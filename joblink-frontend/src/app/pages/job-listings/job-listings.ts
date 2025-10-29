import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-listings',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.scss'
})
export class JobListings implements OnInit {
  searchTerm : string = '';
  jobs: Array<any> = [];
  filteredJobs: Array<any> = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(search?: string) {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobService.getJobs(search ? { search } : undefined).subscribe({
      next: (res) => {
        // map backend Job model to template-friendly shape
  this.jobs = (res.jobs || []).map((j: Job) => ({
          id: j.id,
          title: j.title,
          company: j.companyName || (j as any).company || '',
          location: j.location,
          type: j.jobType || (j as any).type || '',
          description: j.description
        }));
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to load jobs';
      }
    });
  }

  searchJobs() {
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      this.loadJobs(this.searchTerm.trim());
    } else {
      this.loadJobs();
    }
  }

  viewDetails(jobId: number) {
    // If user is authenticated, navigate to details page
    if (this.authService.isAuthenticated()) {
      this.router.navigate([`/jobs/${jobId}`]);
    } else {
      // Show alert and navigate to sign-in
      alert('Please sign in to view job details.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/jobs/${jobId}` } });
    }
  }
}
