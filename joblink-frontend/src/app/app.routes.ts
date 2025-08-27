import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { JobListings } from './pages/job-listings/job-listings';
import { JobDetails } from './pages/job-details/job-details';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings },
    { path: 'jobs/:id', component: JobDetails }
];
