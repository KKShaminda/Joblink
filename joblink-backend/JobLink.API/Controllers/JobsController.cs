using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using JobLink.API.Data;
using JobLink.API.Models.Entities;
using JobLink.API.Models.DTOs;

namespace JobLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/jobs
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs(
            [FromQuery] string? search = null,
            [FromQuery] string? location = null,
            [FromQuery] string? jobType = null,
            [FromQuery] string? experienceLevel = null,
            [FromQuery] decimal? salaryMin = null,
            [FromQuery] decimal? salaryMax = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Jobs
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .Where(j => j.Status == JobStatus.Active);

            // Apply filters
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(j => j.Title.Contains(search) || 
                                        j.Description.Contains(search) ||
                                        j.CompanyName.Contains(search));
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(j => j.Location.Contains(location));
            }

            if (!string.IsNullOrEmpty(jobType))
            {
                query = query.Where(j => j.JobType == jobType);
            }

            if (!string.IsNullOrEmpty(experienceLevel))
            {
                query = query.Where(j => j.ExperienceLevel == experienceLevel);
            }

            if (salaryMin.HasValue)
            {
                query = query.Where(j => j.SalaryMin >= salaryMin.Value);
            }

            if (salaryMax.HasValue)
            {
                query = query.Where(j => j.SalaryMax <= salaryMax.Value);
            }

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new
            {
                Jobs = jobs,
                TotalCount = totalCount,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                PageSize = pageSize
            };

            return Ok(response);
        }

        // GET: api/jobs/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
            {
                return NotFound();
            }

            return job;
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> CreateJob(CreateJobDto createJobDto)
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            // Verify user is a recruiter
            var user = await _context.Users.FindAsync(userId);
            if (user == null || user.Role != UserRole.Recruiter)
            {
                return Forbid("Only recruiters can create job postings");
            }

            {
                return Forbid("Only recruiters can create job postings");
            }

            var job = new Job
            {
                Title = createJobDto.Title,
                Description = createJobDto.Description,
                CompanyName = createJobDto.CompanyName,
                Location = createJobDto.Location,
                JobType = createJobDto.JobType,
                ExperienceLevel = createJobDto.ExperienceLevel,
                SalaryMin = createJobDto.SalaryMin,
                SalaryMax = createJobDto.SalaryMax,
                Requirements = createJobDto.Requirements,
                Benefits = createJobDto.Benefits,
                Deadline = createJobDto.Deadline,
                PostedById = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = JobStatus.Active
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto updateJobDto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            // Check if user owns this job or is admin
            var user = await _context.Users.FindAsync(userId);
            if (job.PostedById != userId && user?.Role != UserRole.Admin)
            {
                return Forbid("You can only edit your own job postings");
            }

            // Update job properties
            if (!string.IsNullOrEmpty(updateJobDto.Title))
                job.Title = updateJobDto.Title;
            if (!string.IsNullOrEmpty(updateJobDto.Description))
                job.Description = updateJobDto.Description;
            if (!string.IsNullOrEmpty(updateJobDto.Location))
                job.Location = updateJobDto.Location;
            if (!string.IsNullOrEmpty(updateJobDto.JobType))
                job.JobType = updateJobDto.JobType;
            if (!string.IsNullOrEmpty(updateJobDto.ExperienceLevel))
                job.ExperienceLevel = updateJobDto.ExperienceLevel;
            if (updateJobDto.SalaryMin.HasValue)
                job.SalaryMin = updateJobDto.SalaryMin;
            if (updateJobDto.SalaryMax.HasValue)
                job.SalaryMax = updateJobDto.SalaryMax;
            if (!string.IsNullOrEmpty(updateJobDto.Requirements))
                job.Requirements = updateJobDto.Requirements;
            if (!string.IsNullOrEmpty(updateJobDto.Benefits))
                job.Benefits = updateJobDto.Benefits;
            if (updateJobDto.Deadline.HasValue)
                job.Deadline = updateJobDto.Deadline;
            if (updateJobDto.Status.HasValue)
                job.Status = updateJobDto.Status.Value;

            job.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/jobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            // Check if user owns this job or is admin
            var user = await _context.Users.FindAsync(userId);
            if (job.PostedById != userId && user?.Role != UserRole.Admin)
            {
                return Forbid("You can only delete your own job postings");
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/jobs/my-jobs
        [HttpGet("my-jobs")]
        public async Task<ActionResult<IEnumerable<Job>>> GetMyJobs()
        {
            // Get current user ID from JWT token
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("Invalid user token");
            }

            var jobs = await _context.Jobs
                .Include(j => j.Applications)
                .Where(j => j.PostedById == userId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs);
        }

        private bool JobExists(int id)
        {
            return _context.Jobs.Any(e => e.Id == id);
        }
    }

    // DTOs for Job operations
    public class CreateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? JobType { get; set; }
        public string? ExperienceLevel { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        public DateTime? Deadline { get; set; }
    }

    public class UpdateJobDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? JobType { get; set; }
        public string? ExperienceLevel { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? Requirements { get; set; }
        public string? Benefits { get; set; }
        public DateTime? Deadline { get; set; }
        public JobStatus? Status { get; set; }
    }
}