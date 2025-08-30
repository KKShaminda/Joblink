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

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings },
    { path: 'jobs/:id', component: JobDetails },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
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
    { path: '**', redirectTo: '' }  // wildcard route to catch undefined paths
];
