import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AnnouncementsComponent } from './announcements/announcements.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
    AnnouncementsComponent
  ],
})
export class AppComponent implements OnInit {
  showAnnouncements = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
      }
    });
  }
}
