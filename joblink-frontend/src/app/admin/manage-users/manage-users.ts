import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss'
})
export class ManageUsers {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Job Seeker', status: 'Active' },
    { id: 2, name: 'Sara Lee', email: 'sara@example.com', role: 'Employer', status: 'Active' },
    { id: 3, name: 'Admin', email: 'admin@joblink.com', role: 'Admin', status: 'Active' }
  ];
}
