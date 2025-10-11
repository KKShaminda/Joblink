import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Job,
  JobApplication,
  SavedJob,
  CreateJobRequest,
  UpdateJobRequest,
  ApplyJobRequest,
  JobSearchParams,
  JobSearchResponse,
  JobStatus,
  ApplicationStatus
} from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private baseUrl = `${environment.apiUrl}/jobs`;
  private applicationsUrl = `${environment.apiUrl}/applications`;
  private savedJobsUrl = `${environment.apiUrl}/saved-jobs`;

  constructor(private http: HttpClient) {}

  // =================== JOB MANAGEMENT ===================
  
  /**
   * Get all jobs with optional search and filtering
   */
  getJobs(searchParams?: JobSearchParams): Observable<JobSearchResponse> {
    let params = new HttpParams();
    
    if (searchParams) {
      if (searchParams.search) params = params.set('search', searchParams.search);
      if (searchParams.location) params = params.set('location', searchParams.location);
      if (searchParams.jobType) params = params.set('jobType', searchParams.jobType);
      if (searchParams.experienceLevel) params = params.set('experienceLevel', searchParams.experienceLevel);
      if (searchParams.salaryMin) params = params.set('salaryMin', searchParams.salaryMin.toString());
      if (searchParams.salaryMax) params = params.set('salaryMax', searchParams.salaryMax.toString());
      if (searchParams.page) params = params.set('page', searchParams.page.toString());
      if (searchParams.pageSize) params = params.set('pageSize', searchParams.pageSize.toString());
    }

    return this.http.get<JobSearchResponse>(this.baseUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a specific job by ID
   */
  getJobById(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new job posting (Recruiters only)
   */
  createJob(jobData: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(this.baseUrl, jobData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing job (Owner/Admin only)
   */
  updateJob(jobId: number, jobData: UpdateJobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/${jobId}`, jobData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a job (Owner/Admin only)
   */
  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get jobs posted by current user (Recruiters)
   */
  getMyPostedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.baseUrl}/my-jobs`)
      .pipe(catchError(this.handleError));
  }

  // =================== JOB APPLICATIONS ===================

  /**
   * Apply for a job
   */
  applyForJob(applicationData: ApplyJobRequest): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.applicationsUrl, applicationData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current user's job applications
   */
  getMyApplications(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.applicationsUrl}/my-applications`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get applications for a specific job (Recruiters only)
   */
  getJobApplications(jobId: number): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.applicationsUrl}/job/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update application status (Recruiters only)
   */
  updateApplicationStatus(applicationId: number, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.applicationsUrl}/${applicationId}/status`, { status })
      .pipe(catchError(this.handleError));
  }

  /**
   * Withdraw job application
   */
  withdrawApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.applicationsUrl}/${applicationId}`)
      .pipe(catchError(this.handleError));
  }

  // =================== SAVED JOBS ===================

  /**
   * Save a job for later
   */
  saveJob(jobId: number): Observable<SavedJob> {
    return this.http.post<SavedJob>(this.savedJobsUrl, { jobId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove job from saved list
   */
  unsaveJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.savedJobsUrl}/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current user's saved jobs
   */
  getSavedJobs(): Observable<SavedJob[]> {
    return this.http.get<SavedJob[]>(this.savedJobsUrl)
      .pipe(catchError(this.handleError));
  }

  // =================== UTILITY METHODS ===================

  /**
   * Check if user has already applied for a job
   */
  hasAppliedForJob(jobId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.applicationsUrl}/check/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Check if job is saved by current user
   */
  isJobSaved(jobId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.savedJobsUrl}/check/${jobId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get job statistics (Admin/Recruiter)
   */
  getJobStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  // =================== HELPER METHODS ===================

  /**
   * Format salary range for display
   */
  formatSalaryRange(salaryMin?: number, salaryMax?: number): string {
    if (!salaryMin && !salaryMax) return 'Salary not specified';
    if (salaryMin && salaryMax) return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
    if (salaryMin) return `From $${salaryMin.toLocaleString()}`;
    if (salaryMax) return `Up to $${salaryMax.toLocaleString()}`;
    return 'Salary not specified';
  }

  /**
   * Calculate days since job was posted
   */
  getDaysSincePosted(createdAt: Date): number {
    const now = new Date();
    const posted = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if job application deadline has passed
   */
  isDeadlinePassed(deadline?: Date): boolean {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  }

  /**
   * Get status badge class for job status
   */
  getStatusBadgeClass(status: JobStatus): string {
    switch (status) {
      case JobStatus.ACTIVE: return 'status-active';
      case JobStatus.CLOSED: return 'status-closed';
      case JobStatus.DRAFT: return 'status-draft';
      case JobStatus.EXPIRED: return 'status-expired';
      default: return 'status-default';
    }
  }

  /**
   * Get application status badge class
   */
  getApplicationStatusBadgeClass(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING: return 'app-status-pending';
      case ApplicationStatus.REVIEWED: return 'app-status-reviewed';
      case ApplicationStatus.INTERVIEW: return 'app-status-interview';
      case ApplicationStatus.ACCEPTED: return 'app-status-accepted';
      case ApplicationStatus.REJECTED: return 'app-status-rejected';
      default: return 'app-status-default';
    }
  }

  /**
   * Error handling
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict occurred';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error: ${error.message}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage }));
  }
}