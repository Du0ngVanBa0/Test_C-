using Microsoft.IdentityModel.Tokens;
using Sapota.DTO.Auth;
using Sapota.Model;
using Sapota.Repository.Interface;
using Sapota.Service.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace Sapota.Service.Implement
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(
            IGenericRepository<User> userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<TokenDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetFirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || string.IsNullOrEmpty(user.PasswordHash) || !BC.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            return await GenerateTokensAsync(user);
        }

        public async Task<TokenDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userRepository.ExistsAsync(u => u.Email == registerDto.Email))
            {
                throw new ArgumentException("Email already exists");
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BC.HashPassword(registerDto.Password),
                createdBy = Guid.NewGuid(),
                updatedBy = Guid.NewGuid()
            };

            user.createdBy = user.Id;
            user.updatedBy = user.Id;

            user = await _userRepository.AddAsync(user);
            return await GenerateTokensAsync(user);
        }

        public async Task<TokenDto> GoogleLoginAsync(GoogleLoginDto googleLoginDto)
        {
            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync($"https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={googleLoginDto.GoogleToken}");

            if (!response.IsSuccessStatusCode)
            {
                throw new UnauthorizedAccessException("Invalid Google token");
            }

            var googleUser = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();

            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
            {
                throw new UnauthorizedAccessException("Unable to retrieve user information from Google");
            }

            var user = await _userRepository.GetFirstOrDefaultAsync(u => u.Email == googleUser.Email);

            if (user == null)
            {
                user = new User
                {
                    Name = googleUser.Name,
                    Email = googleUser.Email,
                    GoogleId = googleUser.Id,
                    createdBy = Guid.NewGuid(),
                    updatedBy = Guid.NewGuid()
                };

                user.createdBy = user.Id;
                user.updatedBy = user.Id;
                user = await _userRepository.AddAsync(user);
            }
            else
            {
                user.GoogleId = googleUser.Id;
                user.Name = googleUser.Name;
                await _userRepository.UpdateAsync(user);
            }

            return await GenerateTokensAsync(user);
        }

        public async Task<TokenDto> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _refreshTokenRepository.GetValidTokenAsync(refreshToken);

            if (storedToken == null)
            {
                throw new UnauthorizedAccessException("Invalid or expired refresh token");
            }

            var user = await _userRepository.GetByIdAsync(storedToken.UserId);
            if (user == null)
            {
                throw new UnauthorizedAccessException("User not found");
            }

            await _refreshTokenRepository.RevokeTokenAsync(refreshToken);

            return await GenerateTokensAsync(user);
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            try
            {
                await _refreshTokenRepository.RevokeTokenAsync(refreshToken);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task RevokeAllUserTokensAsync(Guid userId)
        {
            await _refreshTokenRepository.RevokeUserTokensAsync(userId);
        }

        private async Task<TokenDto> GenerateTokensAsync(User user)
        {
            var accessToken = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                DeviceInfo = GetDeviceInfo(),
                IpAddress = GetClientIpAddress()
            };

            await _refreshTokenRepository.AddAsync(refreshTokenEntity);

            return new TokenDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Expires = DateTime.UtcNow.AddHours(1)
            };
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:SecretKey"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim(ClaimTypes.Email, user.Email ?? "")
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private string GetDeviceInfo()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return request?.Headers["User-Agent"].FirstOrDefault() ?? "Unknown";
        }

        private string GetClientIpAddress()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return request?.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
        }
    }
}
