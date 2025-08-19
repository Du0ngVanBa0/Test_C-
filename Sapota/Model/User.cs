using System.ComponentModel.DataAnnotations;

namespace Sapota.Model
{
    public class User: BaseModel
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PasswordHash { get; set; }
        public string? GoogleId { get; set; }
    }
}
