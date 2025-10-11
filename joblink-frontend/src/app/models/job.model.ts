export enum JobStatus {
  ACTIVE = 'Active',
  CLOSED = 'Closed', 
  DRAFT = 'Draft',
  EXPIRED = 'Expired'
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  FREELANCE = 'Freelance',
  INTERNSHIP = 'Internship'
}

export enum ExperienceLevel {
  ENTRY = 'Entry',
  MID = 'Mid', 
  SENIOR = 'Senior',
  EXECUTIVE = 'Executive'
}

export enum ApplicationStatus {
  PENDING = 'Pending',
  REVIEWED = 'Reviewed',
  INTERVIEW = 'Interview',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  requirements?: string;
  benefits?: string;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  postedById: number;
  recruiterId?: number;
  applicationsCount?: number;
  isApplied?: boolean;
  isSaved?: boolean;
}

export interface JobApplication {
  id: number;
  jobId: number;
  jobSeekerId: number;
  jobSeekerProfileId?: number;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  job?: Job;
}

export interface SavedJob {
  id: number;
  jobId: number;
  jobSeekerId: number;
  savedAt: Date;
  job?: Job;
}

// DTOs for API requests/responses
export interface CreateJobRequest {
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  requirements?: string;
  benefits?: string;
  deadline?: Date;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  requirements?: string;
  benefits?: string;
  deadline?: Date;
  status?: JobStatus;
}

export interface ApplyJobRequest {
  jobId: number;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface JobSearchParams {
  search?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  pageSize?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}