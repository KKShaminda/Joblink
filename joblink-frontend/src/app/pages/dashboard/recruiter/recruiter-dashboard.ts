import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Recruiter } from '../../../models/user.model';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  postedDate: Date;
  applicants: number;
  views: number;
  status: 'active' | 'paused' | 'closed';
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  appliedDate: Date;
  status: 'new' | 'reviewing' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: number;
  skills: string[];
  resumeUrl?: string;
}

@Component({
  selector: 'app-recruiter-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './recruiter-dashboard.html',
  styleUrl: './recruiter-dashboard.scss'
})
export class RecruiterDashboard implements OnInit {
  currentUser: Recruiter | null = null;
  
  // Mock data - replace with actual API calls
  jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'full-time',
      salary: '$90,000 - $120,000',
      postedDate: new Date('2024-10-01'),
      applicants: 24,
      views: 156,
      status: 'active'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: '$110,000 - $140,000',
      postedDate: new Date('2024-09-28'),
      applicants: 18,
      views: 98,
      status: 'active'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'contract',
      salary: '$70 - $90 /hour',
      postedDate: new Date('2024-09-25'),
      applicants: 31,
      views: 203,
      status: 'paused'
    }
  ];

  recentCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      jobTitle: 'Senior Frontend Developer',
      appliedDate: new Date('2024-10-08'),
      status: 'new',
      experience: 5,
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      jobTitle: 'Product Manager',
      appliedDate: new Date('2024-10-07'),
      status: 'reviewing',
      experience: 3,
      skills: ['Product Strategy', 'Analytics', 'Agile']
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      jobTitle: 'UX Designer',
      appliedDate: new Date('2024-10-06'),
      status: 'interview',
      experience: 4,
      skills: ['Figma', 'User Research', 'Prototyping']
    }
  ];

  stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplicants: 156,
    newApplications: 23
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.role === 'recruiter') {
      this.currentUser = user as Recruiter;
    }
  }

  getJobStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  getCandidateStatusClass(status: string): string {
    switch (status) {
      case 'new': return 'status-new';
      case 'reviewing': return 'status-reviewing';
      case 'interview': return 'status-interview';
      case 'offer': return 'status-offer';
      case 'hired': return 'status-hired';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'new': return 'New';
      case 'reviewing': return 'Under Review';
      case 'interview': return 'Interview';
      case 'offer': return 'Offer Sent';
      case 'hired': return 'Hired';
      case 'rejected': return 'Rejected';
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'closed': return 'Closed';
      default: return status;
    }
  }

  logout() {
    this.authService.logout();
  }

  viewJobDetails(jobId: string) {
    console.log('Viewing job details for:', jobId);
  }

  editJob(jobId: string) {
    console.log('Editing job:', jobId);
  }

  pauseJob(jobId: string) {
    const job = this.jobPostings.find(j => j.id === jobId);
    if (job) {
      job.status = job.status === 'active' ? 'paused' : 'active';
    }
  }

  viewCandidate(candidateId: string) {
    console.log('Viewing candidate:', candidateId);
  }

  updateCandidateStatus(candidateId: string, status: string) {
    const candidate = this.recentCandidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.status = status as any;
    }
  }
}