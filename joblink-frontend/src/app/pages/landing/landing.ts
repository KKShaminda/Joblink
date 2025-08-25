import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  searchTerm : string = '';
  jobs = [
    { title: 'Software Engineer', company: 'Tech Corp', location: 'New York, NY', type: 'Full-time' },
    { title: 'Frontend Developer', company: 'Web Solutions', location: 'San Francisco, CA', type: 'Part-time' },
    { title: 'Backend Developer', company: 'Data Systems', location: 'Austin, TX', type: 'Contract' },
    { title: 'UI/UX Designer', company: 'Creative Minds', location: 'Remote', type: 'Full-time' },
    { title: 'DevOps Engineer', company: 'Cloud Services', location: 'Seattle, WA', type: 'Full-time' }
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
