import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { JobSeeker } from '../../../models/user.model';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  salary?: string;
  location: string;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedDate: Date;
  type: string;
}

@Component({
  selector: 'app-job-seeker-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './job-seeker-dashboard.html',
  styleUrl: './job-seeker-dashboard.scss'
})
export class JobSeekerDashboard implements OnInit {
  currentUser: JobSeeker | null = null;
  
  // Mock data - replace with actual API calls
  recentApplications: JobApplication[] = [
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      company: 'TechCorp Inc.',
      appliedDate: new Date('2024-10-05'),
      status: 'reviewing',
      salary: '$70,000 - $90,000',
      location: 'New York, NY'
    },
    {
      id: '2',
      jobTitle: 'UI/UX Designer',
      company: 'Design Studio',
      appliedDate: new Date('2024-10-03'),
      status: 'interview',
      salary: '$65,000 - $80,000',
      location: 'San Francisco, CA'
    },
    {
      id: '3',
      jobTitle: 'Full Stack Developer',
      company: 'StartupXYZ',
      appliedDate: new Date('2024-10-01'),
      status: 'pending',
      salary: '$80,000 - $100,000',
      location: 'Remote'
    }
  ];

  savedJobs: SavedJob[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      salary: '$120,000 - $150,000',
      postedDate: new Date('2024-10-08'),
      type: 'Full-time'
    },
    {
      id: '2',
      title: 'DevOps Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
      postedDate: new Date('2024-10-07'),
      type: 'Full-time'
    }
  ];

  stats = {
    totalApplications: 15,
    activeApplications: 8,
    interviews: 3,
    savedJobs: 12
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'job_seeker') {
      this.currentUser = user as JobSeeker;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewing': return 'status-reviewing';
      case 'interview': return 'status-interview';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'reviewing': return 'Under Review';
      case 'interview': return 'Interview';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }

  logout() {
    this.authService.logout();
  }

  viewJobDetails(jobId: string) {
    // Navigate to job details
    console.log('Viewing job details for:', jobId);
  }

  withdrawApplication(applicationId: string) {
    // Handle application withdrawal
    console.log('Withdrawing application:', applicationId);
  }

  applyToSavedJob(jobId: string) {
    // Handle job application
    console.log('Applying to saved job:', jobId);
  }

  removeSavedJob(jobId: string) {
    // Handle removing saved job
    this.savedJobs = this.savedJobs.filter(job => job.id !== jobId);
  }
}