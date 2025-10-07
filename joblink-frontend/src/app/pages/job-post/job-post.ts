import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-post',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './job-post.html',
  styleUrl: './job-post.scss'
})
export class JobPost {
  jobForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      company: ['', Validators.required],
      location: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.jobForm.valid) {
      console.log('✅ Job Data Submitted:', this.jobForm.value);
      alert('Job posted successfully!');
      this.jobForm.reset();
      this.submitted = false;
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  get f() {
    return this.jobForm.controls;
  }
}
