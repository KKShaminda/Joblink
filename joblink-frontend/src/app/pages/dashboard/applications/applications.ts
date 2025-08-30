import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type AppRow = { title: string; company: string; date: string; status: 'Under Review' | 'Interview' | 'Rejected' | 'Accepted'; };

@Component({
  selector: 'app-applications',
  imports: [ CommonModule ],
  templateUrl: './applications.html',
  styleUrl: './applications.scss'
})
export class Applications {
  rows: AppRow[] = [
    { title: 'Frontend Developer', company: 'ABC Tech', date: '2025-08-10', status: 'Under Review' },
    { title: 'Data Analyst', company: 'Insight Corp', date: '2025-08-08', status: 'Rejected' },
    { title: 'UI/UX Designer', company: 'Creative Minds', date: '2025-08-05', status: 'Interview' },
  ];
}
