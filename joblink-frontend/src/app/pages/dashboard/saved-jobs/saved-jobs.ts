import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Saved = { id: number; title: string; company: string; location: string; };

@Component({
  selector: 'app-saved-jobs',
  imports: [ CommonModule ],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss'
})
export class SavedJobs {
  saved: Saved[] = [
    { id: 1, title: 'Frontend Developer', company: 'ABC Tech', location: 'Colombo' },
    { id: 2, title: 'UI/UX Designer', company: 'Creative Minds', location: 'Galle' },
  ];

  remove(id: number) {
    this.saved = this.saved.filter(s => s.id !== id);
  }
}
