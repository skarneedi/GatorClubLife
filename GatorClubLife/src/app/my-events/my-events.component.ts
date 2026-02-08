import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  category?: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  events: UserEvent[] = [];
  filteredEvents: UserEvent[] = [];
  categories = ['All', 'Workshop', 'Seminar', 'Social', 'Music/Concert'];
  selectedCategory = 'All';
  searchTerm = '';

  ngOnInit(): void {
    // Example data – replace with your API or user-based data
    this.events = [
      {
        id: 1,
        title: 'Angular Workshop',
        date: '2025-04-10',
        location: 'Reitz Union Room 201',
        description: 'An in-depth workshop on Angular for building modern web apps.',
        category: 'Workshop',
        isFavorite: false,
      },
      {
        id: 2,
        title: 'Music Fest',
        date: '2025-05-01',
        location: 'Auditorium Stage',
        description: 'Live music performances from various student bands.',
        category: 'Music/Concert',
        isFavorite: true,
      },
      {
        id: 3,
        title: 'Tech Seminar',
        date: '2025-04-05',
        location: 'Engineering Building',
        description: 'A series of talks on cutting-edge technology trends.',
        category: 'Seminar',
      }
    ];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter((e) => {
      const matchesCategory =
        this.selectedCategory === 'All' || e.category === this.selectedCategory;
      const matchesSearch = e.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  toggleFavorite(eventId: number): void {
    const ev = this.events.find((e) => e.id === eventId);
    if (ev) {
      ev.isFavorite = !ev.isFavorite;
    }
  }
}
