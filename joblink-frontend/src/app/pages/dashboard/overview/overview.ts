import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Card = { label: string; value: number; };

@Component({
  selector: 'app-overview',
  imports: [ CommonModule ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  stats: Card[] = [
    { label: 'Total Jobs', value: 128 },
    { label: 'Saved Jobs', value: 8 },
    { label: 'Applications', value: 12 },
    { label: 'Interviews', value: 3 }
  ];

  recentApplications = [
    { title: 'Frontend Developer', company: 'ABC Tech', status: 'Under Review' },
    { title: 'UI/UX Designer', company: 'Creative Minds', status: 'Interview' },
    { title: 'Data Analyst', company: 'Insight Corp', status: 'Rejected' },
  ];
}
