import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { JobListings } from './pages/job-listings/job-listings';
import { JobDetails } from './pages/job-details/job-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { DashboardLayout } from './pages/dashboard/dashboard-layout/dashboard-layout';
import { Overview } from './pages/dashboard/overview/overview';
import { Applications } from './pages/dashboard/applications/applications';
import { Profile } from './pages/dashboard/profile/profile';
import { SavedJobs } from './pages/dashboard/saved-jobs/saved-jobs';
import { Settings } from './pages/dashboard/settings/settings';
import { JobPost as JobPostComponent } from './pages/job-post/job-post';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { ManageUsers } from './admin/manage-users/manage-users';
import { ManageJobs } from './admin/manage-jobs/manage-jobs';
import { SystemLogs } from './admin/system-logs/system-logs';
import { JobSeekerDashboard } from './pages/dashboard/job-seeker/job-seeker-dashboard';
import { RecruiterDashboard } from './pages/dashboard/recruiter/recruiter-dashboard';
import { 
  AuthGuard, 
  RoleGuard, 
  JobSeekerGuard, 
  RecruiterGuard, 
  AdminGuard 
} from './guards/auth.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
    // Public routes
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings },
    { path: 'job-listings', component: JobListings },
    { path: 'jobs/:id', component: JobDetails },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    
    // Protected job application route
    { 
      path: 'apply/:id', 
      loadComponent: () => import('./pages/job-application/job-application').then(m => m.JobApplication),
      canActivate: [AuthGuard]
    },
    
    // Job posting route - protected for recruiters and admins
    { 
      path: 'job-post', 
      component: JobPostComponent,
      canActivate: [RoleGuard],
      data: { roles: [UserRole.RECRUITER, UserRole.ADMIN] }
    },

    // Job Seeker Dashboard
    {
      path: 'dashboard/job-seeker',
      component: JobSeekerDashboard,
      canActivate: [JobSeekerGuard]
    },

    // Recruiter Dashboard  
    {
      path: 'dashboard/recruiter',
      component: RecruiterDashboard,
      canActivate: [RecruiterGuard]
    },
    
    // Generic dashboard routes for Job Seekers (backwards compatibility)
    {
      path: 'dashboard',
      component: DashboardLayout,
      canActivate: [AuthGuard, RoleGuard],
      data: { roles: [UserRole.JOB_SEEKER] },
      children: [
        { path: '', redirectTo: 'overview', pathMatch: 'full' },
        { path: 'overview', component: Overview },
        { path: 'profile', component: Profile },
        { path: 'saved-jobs', component: SavedJobs },
        { path: 'applications', component: Applications },
        { path: 'settings', component: Settings }
      ]
    },

    // Admin Dashboard
    {
      path: 'admin',
      component: AdminDashboard,
      canActivate: [AdminGuard],
      children: [
        { path: '', component: ManageJobs },
        { path: 'dashboard', component: ManageJobs },
        { path: 'manage-jobs', component: ManageJobs },
        { path: 'manage-users', component: ManageUsers },
        { path: 'system-logs', component: SystemLogs }
      ]
    },

    // Wildcard route - MUST be last!
    { path: '**', redirectTo: '' }
];
