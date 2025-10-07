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

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings },
    { path: 'jobs/:id', component: JobDetails },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'apply/:id', loadComponent: () => import('./pages/job-application/job-application').then(m => m.JobApplication) },
    { path: 'job-post', component: JobPostComponent },
    {
    path: 'dashboard',
    component: DashboardLayout,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: Overview },
      { path: 'profile', component: Profile },
      { path: 'saved-jobs', component: SavedJobs },
      { path: 'applications', component: Applications },
      { path: 'settings', component: Settings }
    ]
  },
    {
    path: 'admin',
    component: AdminDashboard,
    children: [
      { path: '', component: ManageJobs },
      { path: 'manage-jobs', component: ManageJobs },
      { path: 'manage-users', component: ManageUsers },
      { path: 'system-logs', component: SystemLogs }
    ]
  },
    { path: '**', redirectTo: '' }  // wildcard route to catch undefined paths - MUST be last!
];
