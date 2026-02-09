// events.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface EventItem {
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  category: string;
  rsvped?: boolean;
}

import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, ButtonComponent, CardComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchQuery = '';
  selectedDate = '';
  selectedCategory = 'All';
  showModal = false;
  selectedEvent: EventItem | null = null;
  filteredEvents: EventItem[] = [];
  events: EventItem[] = [];
  userEmail = '';
  rsvpMessage = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userEmail = JSON.parse(userData)?.user_email || '';
    }

    this.loadEvents();
  }

  loadEvents(): void {
    // Mock data for UI verification
    const mockEvents: EventItem[] = [
      {
        organization: 'Gator Music Club',
        title: 'Spring Jam Session',
        startDate: '2025-03-15',
        endDate: '2025-03-15',
        location: 'Plaza of the Americas',
        description: 'Join us for an open jam session! Bring your instruments or just come to listen. All skill levels welcome.',
        category: 'Music/Concert',
        rsvped: false
      },
      {
        organization: 'UF Running Club',
        title: 'Charity 5k Run',
        startDate: '2025-03-20',
        endDate: '2025-03-20',
        location: 'Flavet Field',
        description: 'Annual charity run to support local shelters. Registration includes a t-shirt and snacks.',
        category: '5k (Run/Walk)',
        rsvped: true
      },
      {
        organization: 'Gator Robotics',
        title: 'Bot Battle 2025',
        startDate: '2025-03-22',
        endDate: '2025-03-22',
        location: 'Reitz Union Ballroom',
        description: 'Watch student-built robots compete in the arena! Free entry for all students.',
        category: 'Academic',
        rsvped: false
      },
      {
        organization: 'Wellness Center',
        title: 'Sunset Yoga',
        startDate: '2025-03-25',
        endDate: '2025-03-25',
        location: 'Lake Wauburg',
        description: 'Relax and unwind with a guided yoga session by the lake. Mats provided.',
        category: 'Health/Wellness',
        rsvped: false
      },
      {
        organization: 'Volunteer UF',
        title: 'Campus Cleanup',
        startDate: '2025-03-28',
        endDate: '2025-03-28',
        location: 'Turlington Plaza',
        description: 'Help keep our campus beautiful! Supplies and lunch provided for volunteers.',
        category: 'Community Service',
        rsvped: false
      }
    ];

    this.http.get<EventItem[]>('http://localhost:8080/events', { withCredentials: true }).subscribe({
      next: (data) => {
        // If API returns empty (no backend data), use mock data
        this.events = data.length ? data : mockEvents;
        this.filteredEvents = [...this.events];
        console.log("✅ Events loaded:", this.events);
      },
      error: (err) => {
        console.error("❌ Failed to fetch events, using mock data:", err);
        this.events = mockEvents;
        this.filteredEvents = [...this.events];
      }
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event =>
      (this.searchQuery === '' || event.title.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedDate === '' || event.startDate.includes(this.selectedDate)) &&
      (this.selectedCategory === 'All' || event.category === this.selectedCategory)
    );
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDate = '';
    this.selectedCategory = 'All';
    this.filteredEvents = [...this.events];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  openModal(event: EventItem): void {
    this.selectedEvent = event;
    this.showModal = true;
    this.rsvpMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  rsvpToEvent(): void {
    if (!this.selectedEvent) return;

    this.selectedEvent.rsvped = true;
    this.rsvpMessage = 'Sending RSVP...';

    this.http.post('http://localhost:8080/events/send-confirmation', {
      email: this.userEmail,
      event: this.selectedEvent.title
    }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.rsvpMessage = res.message;
        console.log('✅ RSVP success:', res.message);
      },
      error: (err) => {
        console.error('❌ RSVP failed:', err);
        this.rsvpMessage = 'Failed to RSVP. Please try again.';
      }
    });
  }

  undoRSVP(): void {
    if (this.selectedEvent) {
      this.selectedEvent.rsvped = false;
      this.rsvpMessage = 'RSVP cancelled.';
    }
  }
}
