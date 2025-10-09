using System.ComponentModel.DataAnnotations;

namespace JobLink.API.Models.Entities
{
    public class JobSeeker
    {
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        public string? ResumeUrl { get; set; }
        public string? Skills { get; set; }
        public string? Experience { get; set; }
        public string? Education { get; set; }
        public string? Location { get; set; }
        public decimal? ExpectedSalary { get; set; }
        public bool IsAvailable { get; set; } = true;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
        public virtual ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();
    }
}