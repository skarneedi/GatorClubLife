import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { ButtonComponent } from '../button/button.component';
import { Observable } from 'rxjs'; // Import Observable

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isLoggedIn$: Observable<boolean>; // Use Observable type

  navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/organizations', label: 'Clubs' },
    { path: '/events', label: 'Events' },
    { path: '/permits', label: 'Permits' }
  ];

  constructor(public auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  get isAdmin(): boolean {
    return this.auth.getUserDetails()?.role === 'admin';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) this.isUserMenuOpen = false;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) this.isMobileMenuOpen = false;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
    this.closeMobileMenu();
  }
}
