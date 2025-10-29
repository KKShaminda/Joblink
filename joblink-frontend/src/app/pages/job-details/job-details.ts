import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrls: ['./job-details.scss']
})
export class JobDetails implements OnInit {
  jobId: number | null = null;   // store the job ID from URL
  job: any = null; // the selected job details
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    // Get the "id" from the URL
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.jobId) return;

    this.loadJob(this.jobId);
  }

  private loadJob(id: number) {
    this.isLoading = true;
    this.errorMessage = '';
    this.jobService.getJobById(id).subscribe({
      next: (j: Job) => {
        // map backend fields to template-friendly names
        this.job = {
          id: j.id,
          title: j.title,
          company: j.companyName || (j as any).company || '',
          location: j.location,
          type: j.jobType || (j as any).type || '',
          description: j.description,
          salary: j.salaryMin && j.salaryMax ? `$${j.salaryMin.toLocaleString()} - $${j.salaryMax.toLocaleString()}` : (j.salaryMin ? `From $${j.salaryMin}` : (j.salaryMax ? `Up to $${j.salaryMax}` : null)),
          experience: j.experienceLevel,
          deadline: j.deadline ? new Date(j.deadline).toLocaleDateString() : null,
          postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : null,
          requirements: typeof j.requirements === 'string' && j.requirements.includes('\n') ? j.requirements.split('\n') : j.requirements ? [j.requirements] : [],
          benefits: j.benefits ? (Array.isArray(j.benefits) ? j.benefits : [j.benefits]) : [],
          applicants: (j as any).applications ? (j as any).applications.length : 0,
          views: (j as any).views || 0
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Job not found';
        this.job = null;
      }
    });
  }
}
