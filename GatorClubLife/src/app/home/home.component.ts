import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
}

interface Club {
  name: string;
  members: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestAnnouncements: Announcement[] = [];
  upcomingEvents: Event[] = [
    {
      title: 'Robotics Club Launch Party',
      date: 'April 15, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Engineering Building, Room 203'
    },
    {
      title: 'Spring Festival',
      date: 'April 20, 2025',
      time: '12:00 PM - 6:00 PM',
      location: 'Main Quad'
    },
    {
      title: 'Career Networking Night',
      date: 'April 25, 2025',
      time: '6:30 PM - 8:30 PM',
      location: 'Student Union Ballroom'
    }
  ];

  popularClubs: Club[] = [
    { name: 'Robotics Club', members: 42, image: 'robotics.png' },
    { name: 'Photography Society', members: 78, image: 'photo.png' },
    { name: 'Debate Team', members: 35, image: 'debate.png' },
    { name: 'Chess Club', members: 56, image: 'chess.png' }
  ];  

  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/announcements', {
      withCredentials: true
    }).subscribe({
      next: data => {
        this.latestAnnouncements = data
          .sort((a, b) => new Date(b.announcement_created_at).getTime() - new Date(a.announcement_created_at).getTime())
          .slice(0, 3)
          .map((a, i) => ({
            id: i + 1,
            title: a.announcement_title,
            content: a.announcement_message,
            date: a.announcement_created_at,
          }));
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load announcements:', err);
        this.errorMessage = 'Could not load announcements.';
        this.isLoading = false;
      }
    });
  }

  subscribeEmail(event: SubmitEvent): void {
    event.preventDefault();
    alert('Thank you for subscribing!');
  }
}
