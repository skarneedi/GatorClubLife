import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component'; // ✅ Make sure this path is correct
import { AuthService, UserInfo } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    AnnouncementsComponent, // ✅ ✅ Add this
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;
  showAnnouncements = false;
  showDropdown = false;
  currentUser: UserInfo | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.userName$ = this.authService.userInfo$.pipe(
      map(user => user?.name || 'Guest')
    );

    this.authService.userInfo$.subscribe(user => {
      this.currentUser = user;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
      }
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.user-profile-dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.showDropdown = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
