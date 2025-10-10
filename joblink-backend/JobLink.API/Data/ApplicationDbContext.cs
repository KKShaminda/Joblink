using JobLink.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobLink.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets for your entities
        public DbSet<User> Users { get; set; }
        public DbSet<JobSeeker> JobSeekers { get; set; }
        public DbSet<Recruiter> Recruiters { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<SavedJob> SavedJobs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure User entity
            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Configure relationships
            builder.Entity<User>()
                .HasOne(u => u.JobSeeker)
                .WithOne(js => js.User)
                .HasForeignKey<JobSeeker>(js => js.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasOne(u => u.Recruiter)
                .WithOne(r => r.User)
                .HasForeignKey<Recruiter>(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Job>()
                .HasOne(j => j.PostedBy)
                .WithMany(u => u.PostedJobs)
                .HasForeignKey(j => j.PostedById)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Job>()
                .HasOne(j => j.Recruiter)
                .WithMany(r => r.Jobs)
                .HasForeignKey(j => j.RecruiterId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Application>()
                .HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId);

            builder.Entity<Application>()
                .HasOne(a => a.JobSeekerUser)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.JobSeekerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Application>()
                .HasOne(a => a.JobSeekerProfile)
                .WithMany(js => js.Applications)
                .HasForeignKey(a => a.JobSeekerProfileId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<SavedJob>()
                .HasOne(sj => sj.Job)
                .WithMany(j => j.SavedJobs)
                .HasForeignKey(sj => sj.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SavedJob>()
                .HasOne(sj => sj.JobSeeker)
                .WithMany(js => js.SavedJobs)
                .HasForeignKey(sj => sj.JobSeekerId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure decimal precision
            builder.Entity<Job>()
                .Property(j => j.SalaryMin)
                .HasPrecision(18, 2);

            builder.Entity<Job>()
                .Property(j => j.SalaryMax)
                .HasPrecision(18, 2);

            builder.Entity<JobSeeker>()
                .Property(js => js.ExpectedSalary)
                .HasPrecision(18, 2);

            // Configure indexes for better performance
            builder.Entity<Job>()
                .HasIndex(j => j.Title);

            builder.Entity<Job>()
                .HasIndex(j => j.Location);

            builder.Entity<Job>()
                .HasIndex(j => j.Status);

            builder.Entity<Job>()
                .HasIndex(j => j.CreatedAt);

            // Prevent duplicate applications for same job by same user
            builder.Entity<Application>()
                .HasIndex(a => new { a.JobId, a.JobSeekerId })
                .IsUnique();

            // Prevent duplicate saved jobs
            builder.Entity<SavedJob>()
                .HasIndex(sj => new { sj.JobId, sj.JobSeekerId })
                .IsUnique();
        }
    }
}