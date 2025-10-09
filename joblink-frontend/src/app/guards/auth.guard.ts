import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (requiredRoles && !this.authService.hasAnyRole(requiredRoles)) {
      // Redirect to appropriate dashboard based on user role
      this.authService.redirectToDashboard();
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class JobSeekerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.hasRole(UserRole.JOB_SEEKER)) {
      return true;
    } else {
      this.authService.redirectToDashboard();
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class RecruiterGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.hasRole(UserRole.RECRUITER)) {
      return true;
    } else {
      this.authService.redirectToDashboard();
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.hasRole(UserRole.ADMIN)) {
      return true;
    } else {
      this.authService.redirectToDashboard();
      return false;
    }
  }
}