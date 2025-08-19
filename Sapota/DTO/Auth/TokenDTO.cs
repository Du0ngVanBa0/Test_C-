using System.ComponentModel.DataAnnotations;

namespace Sapota.DTO.Auth
{
    public class TokenDto
    {
        [Required(ErrorMessage = "Access token is required.")]
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
    }

    public class RefreshTokenDto
    {
        [Required(ErrorMessage = "Refresh token is required.")]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
