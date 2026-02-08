import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css']
})
export class EventsFormComponent {
  eventName = '';
  eventPurpose = '';
  expectedAttendance: number | null = null;

  categories = [
    'BANNERS',
    'CENTURY TOWER LIGHTING',
    'GENERAL',
    'RUN/WALK',
    'TABLING'
  ];

  selectedCategories: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private permitService: EventPermitService
  ) {}

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  goToEventDates(): void {
    if (
      this.eventName.trim() === '' ||
      this.eventPurpose.trim() === '' ||
      this.expectedAttendance === null ||
      this.expectedAttendance <= 0 ||
      this.selectedCategories.length === 0
    ) {
      alert('Please fill out all fields before continuing.');
      return;
    }

    this.permitService.setBasicInfo({
      event_name: this.eventName,
      event_description: this.eventPurpose,
      expected_attendance: this.expectedAttendance,
      event_categories: this.selectedCategories.join(', ')
    });

    this.router.navigate(['/dates']);
  }
}
