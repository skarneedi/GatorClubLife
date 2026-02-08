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

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userEmail = JSON.parse(userData)?.user_email || '';
    }

    this.loadEvents();
  }

  loadEvents(): void {
    this.http.get<EventItem[]>('http://localhost:8080/events', { withCredentials: true }).subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = [...this.events];
        console.log("✅ Events loaded:", this.events);
      },
      error: (err) => {
        console.error("❌ Failed to fetch events:", err);
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
