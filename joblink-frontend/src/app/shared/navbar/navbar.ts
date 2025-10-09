import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  userMenuOpen = false;
  isLoggedIn = false;
  currentUser: User | null = null;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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
    if (this.currentUser && this.currentUser.fullName) {
      return this.currentUser.fullName
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }
}
