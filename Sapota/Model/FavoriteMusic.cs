using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sapota.Model
{
    public class FavoriteMusic: BaseModel
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        [ForeignKey("User")]
        public Guid UserId { get; set; }
    }
}
