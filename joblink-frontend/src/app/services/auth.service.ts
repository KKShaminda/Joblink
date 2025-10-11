import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { 
  User, 
  UserRole, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  JobSeeker,
  Recruiter,
  Admin 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();



  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check for existing token on service initialization
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          // Invalid stored user data, remove it
          this.logout();
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<any>(`${this.baseUrl}/login`, loginData)
      .pipe(
        tap(response => {
          // Convert backend response to frontend format
          const loginResponse: LoginResponse = {
            token: response.token,
            user: this.mapBackendUserToFrontend(response.user),
            expiresIn: Math.floor((new Date(response.expiration).getTime() - Date.now()) / 1000)
          };
          
          // Store token and user data
          localStorage.setItem('authToken', loginResponse.token);
          localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
          this.currentUserSubject.next(loginResponse.user);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    const registerData = {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: this.mapFrontendRoleToBackend(userData.role),
      companyName: userData.companyName || undefined
    };

    return this.http.post<any>(`${this.baseUrl}/register`, registerData)
      .pipe(
        tap(response => {
          // Convert backend response to frontend format
          const loginResponse: LoginResponse = {
            token: response.token,
            user: this.mapBackendUserToFrontend(response.user),
            expiresIn: Math.floor((new Date(response.expiration).getTime() - Date.now()) / 1000)
          };

          // Store token and user data
          localStorage.setItem('authToken', loginResponse.token);
          localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
          this.currentUserSubject.next(loginResponse.user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  redirectToDashboard(): void {
    const user = this.getCurrentUser();
    if (!user) return;

    switch (user.role) {
      case UserRole.JOB_SEEKER:
        this.router.navigate(['/dashboard/job-seeker']);
        break;
      case UserRole.RECRUITER:
        this.router.navigate(['/dashboard/recruiter']);
        break;
      case UserRole.ADMIN:
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private mapFrontendRoleToBackend(role: UserRole): string {
    switch (role) {
      case UserRole.JOB_SEEKER:
        return 'JobSeeker';
      case UserRole.RECRUITER:
        return 'Recruiter';
      case UserRole.ADMIN:
        return 'Admin';
      default:
        return 'JobSeeker';
    }
  }

  private mapBackendRoleToFrontend(role: string): UserRole {
    switch (role.toLowerCase()) {
      case 'jobseeker':
        return UserRole.JOB_SEEKER;
      case 'recruiter':
        return UserRole.RECRUITER;
      case 'admin':
        return UserRole.ADMIN;
      default:
        return UserRole.JOB_SEEKER;
    }
  }

  private mapBackendUserToFrontend(backendUser: any): User {
    const role = this.mapBackendRoleToFrontend(backendUser.role);
    
    const baseUser: User = {
      id: backendUser.id,
      email: backendUser.email,
      fullName: backendUser.fullName,
      role: role,
      isActive: true,
      createdAt: new Date(backendUser.createdAt)
    };

    // Add role-specific properties based on the role
    switch (role) {
      case UserRole.JOB_SEEKER:
        return {
          ...baseUser,
          role: UserRole.JOB_SEEKER,
          skills: [],
          experience: 0,
          location: '',
          preferredJobTypes: []
        } as JobSeeker;
      
      case UserRole.RECRUITER:
        return {
          ...baseUser,
          role: UserRole.RECRUITER,
          companyName: '',
          companySize: '',
          industry: '',
          verified: false,
          jobsPosted: 0
        } as Recruiter;
      
      case UserRole.ADMIN:
        return {
          ...baseUser,
          role: UserRole.ADMIN,
          permissions: ['manage_users', 'manage_jobs', 'view_analytics'],
          department: 'IT'
        } as Admin;
      
      default:
        return baseUser;
    }
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad request';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Error: ${error.error?.message || error.message}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage }));
  }

  // Method to get demo credentials for testing
  getDemoCredentials(): { [key: string]: LoginRequest } {
    return {
      jobSeeker: {
        email: 'test@jobseeker.com',
        password: 'Test123!'
      },
      recruiter: {
        email: 'test@recruiter.com',
        password: 'Test123!'
      },
      admin: {
        email: 'test@admin.com',
        password: 'Test123!'
      }
    };
  }
}