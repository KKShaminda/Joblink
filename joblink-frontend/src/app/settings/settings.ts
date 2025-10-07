import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent {
  form: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false],
      darkMode: [false]
    });
  }

  save() {
    console.log('Settings saved:', this.form.value);
    alert('Settings saved!');
  }
}
