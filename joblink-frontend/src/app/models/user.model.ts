export enum UserRole {
  JOB_SEEKER = 'job_seeker',
  RECRUITER = 'recruiter', 
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface JobSeeker extends User {
  role: UserRole.JOB_SEEKER;
  skills: string[];
  experience: number;
  location: string;
  resume?: string;
  preferredJobTypes: string[];
  expectedSalary?: number;
}

export interface Recruiter extends User {
  role: UserRole.RECRUITER;
  companyName: string;
  companySize: string;
  industry: string;
  verified: boolean;
  jobsPosted: number;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
  permissions: string[];
  department: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  // Additional fields based on role
  companyName?: string; // For recruiters
  skills?: string[]; // For job seekers
}