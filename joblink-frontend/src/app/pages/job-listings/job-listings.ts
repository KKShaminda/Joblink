import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-listings',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.scss'
})
export class JobListings {
  searchTerm : string = '';
  jobs = [
    { title: 'Software Engineer', company: 'Tech Corp', location: 'New York, NY', type: 'Full-time', description: 'Develop and maintain web applications.' },
    { title: 'Frontend Developer', company: 'Web Solutions', location: 'San Francisco, CA', type: 'Part-time', description: 'Create user-friendly web interfaces.' },
    { title: 'Backend Developer', company: 'Data Systems', location: 'Austin, TX', type: 'Contract', description: 'Build and optimize server-side logic.' },
    { title: 'UI/UX Designer', company: 'Creative Minds', location: 'Remote', type: 'Full-time', description: 'Design engaging user experiences.' },
    { title: 'DevOps Engineer', company: 'Cloud Services', location: 'Seattle, WA', type: 'Full-time', description: 'Manage cloud infrastructure and deployments.' }
  ];
  filteredJobs = [...this.jobs];

  searchJobs() {
    this.filteredJobs = this.jobs.filter(job =>
      job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
