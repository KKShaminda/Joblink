using System.ComponentModel.DataAnnotations;

namespace JobLink.API.Models.Entities
{
    public class Application
    {
        public int Id { get; set; }
        
        public int JobId { get; set; }
        public string JobSeekerId { get; set; } = string.Empty;
        public int? JobSeekerProfileId { get; set; }
        
        public string? CoverLetter { get; set; }
        public string? ResumeUrl { get; set; }
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
        
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Job Job { get; set; } = null!;
        public virtual User JobSeekerUser { get; set; } = null!;
        public virtual JobSeeker? JobSeekerProfile { get; set; }
    }

    public enum ApplicationStatus
    {
        Pending = 1,
        Reviewed = 2,
        Interview = 3,
        Accepted = 4,
        Rejected = 5
    }
}