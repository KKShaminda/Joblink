import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ Initialize inside constructor
    this.form = this.fb.group({
      theme: ['light', Validators.required],
      notifications: [true],
    });
  }

  save() {
    if (this.form.valid) {
      console.log('Settings saved:', this.form.value);
    }
  }

}
