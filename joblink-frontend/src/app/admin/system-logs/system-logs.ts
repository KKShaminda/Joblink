import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-logs',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './system-logs.html',
  styleUrl: './system-logs.scss'
})
export class SystemLogs {
  logs = [
    'User John logged in at 10:25 AM',
    'Admin updated job #2 at 11:10 AM',
    'Employer posted new job "DevOps Engineer"',
    'System backup completed successfully'
  ];
}
