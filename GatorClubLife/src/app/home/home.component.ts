import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface Club {
  name: string;
  members: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, RouterLink], // Added UI components
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestAnnouncements: Announcement[] = [];
  upcomingEvents: Event[] = [
    {
      id: 1,
      title: 'Robotics Club Launch Party',
      date: 'April 15, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Engineering Building, Room 203'
    },
    {
      id: 2,
      title: 'Spring Festival',
      date: 'April 20, 2025',
      time: '12:00 PM - 6:00 PM',
      location: 'Main Quad'
    },
    {
      id: 3,
      title: 'Career Networking Night',
      date: 'April 25, 2025',
      time: '6:30 PM - 8:30 PM',
      location: 'Student Union Ballroom'
    }
  ];

  popularClubs: Club[] = [
    { name: 'Robotics Club', members: 42, image: 'robotics.png', description: 'Innovating the future.' },
    { name: 'Photography Society', members: 78, image: 'photo.png', description: 'Capturing moments.' },
    { name: 'Debate Team', members: 35, image: 'debate.png', description: 'Voice of reason.' },
    { name: 'Chess Club', members: 56, image: 'chess.png', description: 'Checkmate your boredom.' }
  ];

  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Mock Data for Verification
    const mockAnnouncements = [
      { id: 1, title: 'Fall Registration Open', content: 'Sign up for classes starting today!', date: '2025-02-10' },
      { id: 2, title: 'Library Hours Extended', content: 'Marston is now open 24/7 for finals week.', date: '2025-02-08' },
      { id: 3, title: 'Guest Speaker: Dr. Smith', content: 'Join us in the auditorium for a talk on AI.', date: '2025-02-05' }
    ];

    this.popularClubs = [
      { name: 'Gator Robotics', image: 'robotics.jpg', description: 'Building the future, one bot at a time.', members: 120 },
      { name: 'Debate Team', image: 'debate.jpg', description: 'Sharpen your speaking skills.', members: 85 },
      { name: 'Dance Marathon', image: 'dance.jpg', description: 'For the kids! Join the movement.', members: 300 },
      { name: 'Chess Club', image: 'chess.jpg', description: 'Strategy and fun every Friday.', members: 45 }
    ];

    this.upcomingEvents = [
      { id: 1, title: 'Spring Concert', date: '2025-03-15', time: '7:00 PM', location: 'O-Connell Center' },
      { id: 2, title: 'Career Showcase', date: '2025-03-18', time: '9:00 AM', location: 'Reitz Union' },
      { id: 3, title: 'Gator Game Day', date: '2025-03-22', time: '1:00 PM', location: 'The Swamp' },
      { id: 4, title: 'Art Exhibit Opening', date: '2025-03-25', time: '6:00 PM', location: 'Fine Arts Hall' }
    ];

    this.http.get<any[]>('http://localhost:8080/announcements', {
      withCredentials: true
    }).subscribe({
      next: data => {
        this.latestAnnouncements = data.length
          ? data.sort((a, b) => new Date(b.announcement_created_at).getTime() - new Date(a.announcement_created_at).getTime())
            .slice(0, 3)
            .map((a, i) => ({
              id: i + 1,
              title: a.announcement_title,
              content: a.announcement_message,
              date: a.announcement_created_at,
            }))
          : mockAnnouncements;

        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load announcements, using mock data:', err);
        this.latestAnnouncements = mockAnnouncements;
        this.isLoading = false;
      }
    });
  }

  subscribeEmail(event: SubmitEvent): void {
    event.preventDefault();
    alert('Thank you for subscribing!');
  }
}
