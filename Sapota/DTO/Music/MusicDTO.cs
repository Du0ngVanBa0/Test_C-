using System.ComponentModel.DataAnnotations;

namespace Sapota.DTO.Music
{
    public class FavoriteMusicDto
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Artist { get; set; }
    }

    public class CreateFavoriteMusicDto
    {
        [Required(ErrorMessage = "Title is required.")]
        public string? Title { get; set; }
        [Required(ErrorMessage = "Artist is required.")]
        public string? Artist { get; set; }
    }

    public class UpdateFavoriteMusicDto
    {
        [Required(ErrorMessage = "Title is required.")]
        public string? Title { get; set; }
        [Required(ErrorMessage = "Artist is required.")]
        public string? Artist { get; set; }
    }
}
