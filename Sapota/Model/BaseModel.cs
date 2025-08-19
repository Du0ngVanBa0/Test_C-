namespace Sapota.Model
{
    public abstract class BaseModel
    {
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid createdBy { get; set; }
        public Guid updatedBy { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
