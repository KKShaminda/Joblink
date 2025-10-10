using System.ComponentModel.DataAnnotations;

namespace JobLink.API.Models.Entities
{
    public class Job
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;
        
        public string? JobType { get; set; } // Full-time, Part-time, Contract
        public string? ExperienceLevel { get; set; } // Entry, Mid, Senior
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        public JobStatus Status { get; set; } = JobStatus.Active;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? Deadline { get; set; }
        
        // Foreign Keys
        public int PostedById { get; set; }
        public int? RecruiterId { get; set; }
        
        // Navigation properties
        public virtual User PostedBy { get; set; } = null!;
        public virtual Recruiter? Recruiter { get; set; }
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
        public virtual ICollection<SavedJob> SavedJobs { get; set; } = new List<SavedJob>();
    }

    public enum JobStatus
    {
        Active = 1,
        Closed = 2,
        Draft = 3,
        Expired = 4
    }
}