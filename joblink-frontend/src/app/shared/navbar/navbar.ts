import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  mobileMenuOpen = false;
  userMenuOpen = false;
  isLoggedIn = false; // This should be connected to your auth service
  currentUser: any = null; // This should be connected to your auth service

  constructor() {
    // Initialize auth state - connect to your auth service here
    this.checkAuthState();
  }

  private checkAuthState() {
    // TODO: Connect to your authentication service
    // Example: this.isLoggedIn = this.authService.isAuthenticated();
    // Example: this.currentUser = this.authService.getCurrentUser();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  getUserInitials(): string {
    if (this.currentUser && this.currentUser.name) {
      return this.currentUser.name
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  }

  logout() {
    // TODO: Connect to your authentication service
    // Example: this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.userMenuOpen = false;
  }
}
