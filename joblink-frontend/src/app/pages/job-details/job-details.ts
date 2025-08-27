import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrls: ['./job-details.scss']
})
export class JobDetails implements OnInit {
  jobId: number | null = null;   // store the job ID from URL

  // Mock job data (later we will fetch from backend)
  jobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Solutions', description: 'Develop and maintain software applications.' },
    { id: 2, title: 'Data Analyst', company: 'Data Corp', description: 'Analyze data and create reports for business decisions.' },
    { id: 3, title: 'Web Developer', company: 'Web Innovations', description: 'Build and optimize modern web applications.' }
  ];

  job: any = null; // the selected job details

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the "id" from the URL
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));

    // Find the job with that ID
    this.job = this.jobs.find(j => j.id === this.jobId);
  }
}
