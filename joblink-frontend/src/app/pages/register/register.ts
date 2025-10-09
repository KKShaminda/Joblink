import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole, RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule, CommonModule, RouterModule ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  UserRole = UserRole; // Make enum available in template

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: [UserRole.JOB_SEEKER, [Validators.required]],
      companyName: [''], // For recruiters
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });

    // Watch role changes to update validation
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateRoleValidation(role);
    });

    // Check if user is already logged in
    if (this.authService.isAuthenticated()) {
      this.authService.redirectToDashboard();
    }
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Update validation based on selected role
  updateRoleValidation(role: UserRole) {
    const companyNameControl = this.registerForm.get('companyName');
    
    if (role === UserRole.RECRUITER) {
      companyNameControl?.setValidators([Validators.required]);
    } else {
      companyNameControl?.clearValidators();
    }
    
    companyNameControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
        companyName: this.registerForm.value.companyName || undefined
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful:', response);
          this.authService.redirectToDashboard();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Mark all form fields as touched to show validation errors
  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registerForm.get(fieldName);
    if (errorType) {
      return field ? field.hasError(errorType) && field.touched : false;
    }
    return field ? field.invalid && field.touched : false;
  }
}
