namespace JobLink.API.Models.Entities
{
    public class SavedJob
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int JobSeekerId { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Job Job { get; set; } = null!;
        public virtual JobSeeker JobSeeker { get; set; } = null!;
    }
}