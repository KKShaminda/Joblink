using System.ComponentModel.DataAnnotations;

namespace JobLink.API.Models.Entities
{
    public class Recruiter
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; } = string.Empty;
        
        public string? CompanyDescription { get; set; }
        public string? Website { get; set; }
        public string? Industry { get; set; }
        public string? CompanySize { get; set; }
        public string? Location { get; set; }
        public string? LogoUrl { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}