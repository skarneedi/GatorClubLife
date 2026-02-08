import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-event-dates',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './event-dates.component.html',
  styleUrls: ['./event-dates.component.css']
})
export class EventDatesComponent {
  calendarEvents: any[] = [];

  constructor(
    private router: Router,
    private permitService: EventPermitService
  ) {}

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    dateClick: this.handleDateClick.bind(this)
  };

  handleDateClick(arg: any) {
    const title = prompt('Enter event title (optional):') || 'Event';
    this.calendarEvents.push({
      title,
      start: arg.dateStr,
      end: arg.dateStr
    });
    this.updateCalendar();
  }

  addEvent() {
    const title = prompt('Enter event title:') || 'Event';
    const start = prompt('Enter start (YYYY-MM-DD):');
    const end = prompt('Enter end (YYYY-MM-DD):');
    if (start && end) {
      this.calendarEvents.push({ title, start, end });
      this.updateCalendar();
    }
  }

  updateCalendar() {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.calendarEvents]
    };
  }

  goBack(): void {
    this.router.navigate(['/forms', this.permitService.getPermitType()]);
  }

  goToNextPage(): void {
    // Transform events into { start_time, end_time }
    const slots = this.calendarEvents.map(event => ({
      start_time: event.start,
      end_time: event.end || event.start
    }));

    this.permitService.setSlots(slots);
    this.router.navigate(['/additional-forms']);
  }
}