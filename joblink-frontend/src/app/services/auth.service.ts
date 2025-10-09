import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
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
  private baseUrl = 'http://localhost:3000/api/auth'; // Replace with your backend URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users for development (replace with actual backend calls)
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'jobseeker@test.com',
      fullName: 'John Doe',
      role: UserRole.JOB_SEEKER,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    } as JobSeeker,
    {
      id: '2', 
      email: 'recruiter@test.com',
      fullName: 'Jane Smith',
      role: UserRole.RECRUITER,
      companyName: 'TechCorp',
      companySize: '100-500',
      industry: 'Technology',
      verified: true,
      jobsPosted: 15,
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    } as Recruiter,
    {
      id: '3',
      email: 'admin@test.com', 
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      permissions: ['manage_users', 'manage_jobs', 'view_analytics'],
      department: 'IT',
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    } as Admin
  ];

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
      // In a real app, verify token with backend
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock login - replace with actual HTTP call
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => 
          u.email === credentials.email && u.role === credentials.role
        );

        if (user) {
          const response: LoginResponse = {
            token: this.generateMockToken(),
            user: user,
            expiresIn: 3600
          };
          
          // Store token and user data
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          
          observer.next(response);
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
        observer.complete();
      }, 1000);
    });

    // Real implementation would be:
    // return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
    //   .pipe(
    //     tap(response => {
    //       localStorage.setItem('authToken', response.token);
    //       localStorage.setItem('currentUser', JSON.stringify(response.user));
    //       this.currentUserSubject.next(response.user);
    //     })
    //   );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    // Mock registration - replace with actual HTTP call
    return new Observable(observer => {
      setTimeout(() => {
        const newUser: User = {
          id: Date.now().toString(),
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          isActive: true,
          createdAt: new Date()
        };

        // Add role-specific properties
        if (userData.role === UserRole.RECRUITER && userData.companyName) {
          (newUser as Recruiter).companyName = userData.companyName;
          (newUser as Recruiter).verified = false;
          (newUser as Recruiter).jobsPosted = 0;
        } else if (userData.role === UserRole.JOB_SEEKER && userData.skills) {
          (newUser as JobSeeker).skills = userData.skills;
          (newUser as JobSeeker).experience = 0;
        }

        this.mockUsers.push(newUser);

        const response: LoginResponse = {
          token: this.generateMockToken(),
          user: newUser,
          expiresIn: 3600
        };

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);

        observer.next(response);
        observer.complete();
      }, 1000);
    });
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

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Method to get demo credentials for testing
  getDemoCredentials(): { [key: string]: LoginRequest } {
    return {
      jobSeeker: {
        email: 'jobseeker@test.com',
        password: 'password123',
        role: UserRole.JOB_SEEKER
      },
      recruiter: {
        email: 'recruiter@test.com',
        password: 'password123',
        role: UserRole.RECRUITER
      },
      admin: {
        email: 'admin@test.com',
        password: 'password123',
        role: UserRole.ADMIN
      }
    };
  }
}