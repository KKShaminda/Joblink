import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-jobs',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './manage-jobs.html',
  styleUrl: './manage-jobs.scss'
})
export class ManageJobs {
  jobs = [
    { id: 1, title: 'Frontend Developer', company: 'TechNova', status: 'Active' },
    { id: 2, title: 'Backend Engineer', company: 'CodeWave', status: 'Closed' },
    { id: 3, title: 'UI/UX Designer', company: 'Softify', status: 'Active' }
  ];
}
