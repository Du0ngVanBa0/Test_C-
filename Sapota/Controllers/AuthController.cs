using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sapota.DTO.Auth;
using Sapota.Model;
using Sapota.Service.Interface;

namespace Sapota.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<TokenDto>> Register(RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDto>> Login(LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<TokenDto>> GoogleLogin(GoogleLoginDto googleLoginDto)
        {
            try
            {
                var result = await _authService.GoogleLoginAsync(googleLoginDto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenDto>> RefreshToken(RefreshTokenDto refreshTokenDto)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<IActionResult> RevokeToken(RefreshTokenDto refreshTokenDto)
        {
            var result = await _authService.RevokeTokenAsync(refreshTokenDto.RefreshToken);

            if (!result)
                return BadRequest(new { message = "Invalid token" });

            return Ok(new { message = "Token revoked successfully" });
        }

        [HttpPost("logout-all-devices")]
        [Authorize]
        public async Task<IActionResult> LogoutAllDevices()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                await _authService.RevokeAllUserTokensAsync(userId);
                return Ok(new { message = "Logged out from all devices successfully" });
            }

            return BadRequest(new { message = "User not found" });
        }
    }
}
