import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { JobListings } from './pages/job-listings/job-listings';
import { JobDetails } from './pages/job-details/job-details';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings },
    { path: 'jobs/:id', component: JobDetails },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '**', redirectTo: '' }  // wildcard route to catch undefined paths
];
