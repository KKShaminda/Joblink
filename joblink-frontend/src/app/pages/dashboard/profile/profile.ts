import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['Kaveesha Shaminda', [Validators.required, Validators.minLength(3)]],
      email: ['kaveesha@example.com', [Validators.required, Validators.email]],
      location: ['Colombo', [Validators.required]],
      headline: ['Frontend Developer'],
      bio: ['Passionate about Angular and building scalable UIs.']
    });
  }

  save() {
    if (this.form.valid) {
      console.log('Profile saved:', this.form.value);
      alert('Profile saved!');
    } else {
      this.form.markAllAsTouched();
    }
  }
}

