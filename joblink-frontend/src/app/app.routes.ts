import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { JobListings } from './pages/job-listings/job-listings';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'jobs', component: JobListings }
];
