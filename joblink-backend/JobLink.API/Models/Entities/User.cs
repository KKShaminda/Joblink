using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace JobLink.API.Models.Entities
{
    public class User : IdentityUser
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual JobSeeker? JobSeeker { get; set; }
        public virtual Recruiter? Recruiter { get; set; }
        public virtual ICollection<Job> PostedJobs { get; set; } = new List<Job>();
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }

    public enum UserRole
    {
        JobSeeker = 1,
        Recruiter = 2,
        Admin = 3
    }
}