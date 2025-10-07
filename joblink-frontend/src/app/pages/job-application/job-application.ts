import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-application',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './job-application.html',
  styleUrl: './job-application.scss'
})
export class JobApplication {
  jobId!: number;
  jobTitle = '';
  applicationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Get job ID from route parameter
    this.jobId = Number(this.route.snapshot.paramMap.get('id'));

    // Simulate fetching job title based on ID
    this.jobTitle = this.getJobTitleById(this.jobId);

    // Initialize the application form
    this.applicationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      resumeLink: ['', [Validators.required]],
      coverLetter: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Mock function — later we’ll connect it to backend
  getJobTitleById(id: number): string {
    const jobs = [
      { id: 1, title: 'Frontend Developer' },
      { id: 2, title: 'Backend Engineer' },
      { id: 3, title: 'Full Stack Developer' }
    ];
    const job = jobs.find(j => j.id === id);
    return job ? job.title : 'Unknown Job';
  }

  // Form submission
  onSubmit() {
    if (this.applicationForm.valid) {
      console.log('Application Data:', this.applicationForm.value);
      alert(`Application submitted for ${this.jobTitle}`);
      this.applicationForm.reset();
    } else {
      alert('Please fill in all required fields correctly.');
      this.applicationForm.markAllAsTouched();
    }
  }
}
