using Sapota.DTO.Auth;
using Sapota.Model;

namespace Sapota.Service.Interface
{
    public interface IAuthService
    {
        Task<TokenDto> LoginAsync(LoginDto loginDto);
        Task<TokenDto> RegisterAsync(RegisterDto registerDto);
        Task<TokenDto> GoogleLoginAsync(GoogleLoginDto googleLoginDto);
        Task<TokenDto> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);
        Task RevokeAllUserTokensAsync(Guid userId);
        string GenerateJwtToken(User user);
        string GenerateRefreshToken();
    }
}
