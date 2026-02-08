import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserInfo } from '../auth.service';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  expanded?: boolean;
  priority?: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];

  user: UserInfo | null = null;
  isAdmin = false;

  newTitle = '';
  newContent = '';
  selectedCategory = 'All';
  searchTerm = '';

  categories: string[] = ['All', 'Club News', 'Events', 'Reminders'];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.role === 'admin';
    });

    this.http.get<any[]>('http://localhost:8080/announcements', {
      withCredentials: true
    }).subscribe({    
      next: (data) => {
        this.announcements = data.map((a, i) => ({
          id: i + 1,
          title: a.announcement_title,
          content: a.announcement_message,
          date: a.announcement_created_at,
          expanded: false,
          priority: 'NORMAL'
        }));
        this.filteredAnnouncements = [...this.announcements];
      },
      error: (err) => console.error('Error fetching announcements:', err)
    });
  }

  toggleExpand(id: number): void {
    this.filteredAnnouncements = this.filteredAnnouncements.map(a =>
      a.id === id ? { ...a, expanded: !a.expanded } : a
    );
  }

  filterAnnouncements(): void {
    this.filteredAnnouncements = this.announcements.filter(a => {
      const matchesCategory = this.selectedCategory === 'All' || a.title.includes(this.selectedCategory);
      const matchesSearch = a.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            a.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
}