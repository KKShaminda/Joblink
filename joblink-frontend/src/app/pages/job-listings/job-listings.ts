import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-listings',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.scss'
})
export class JobListings {
  searchTerm : string = '';
  jobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'New York, NY', type: 'Full-time', description: 'Develop and maintain web applications.' },
    { id: 2, title: 'Frontend Developer', company: 'Web Solutions', location: 'San Francisco, CA', type: 'Part-time', description: 'Create user-friendly web interfaces.' },
    { id: 3, title: 'Backend Developer', company: 'Data Systems', location: 'Austin, TX', type: 'Contract', description: 'Build and optimize server-side logic.' },
    { id: 4, title: 'UI/UX Designer', company: 'Creative Minds', location: 'Remote', type: 'Full-time', description: 'Design engaging user experiences.' },
    { id: 5, title: 'DevOps Engineer', company: 'Cloud Services', location: 'Seattle, WA', type: 'Full-time', description: 'Manage cloud infrastructure and deployments.' }
  ];
  filteredJobs = [...this.jobs];

  constructor(private router: Router, private authService: AuthService) {}

  searchJobs() {
    this.filteredJobs = this.jobs.filter(job =>
      job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewDetails(jobId: number) {
    // If user is authenticated, navigate to details page
    if (this.authService.isAuthenticated()) {
      this.router.navigate([`/job-details/${jobId}`]);
    } else {
      // Show alert and navigate to sign-in
      alert('Please sign in to view job details.');
      this.router.navigate(['/login']);
    }
  }
}
