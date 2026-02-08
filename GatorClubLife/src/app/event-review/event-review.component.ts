import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { EventPermitService } from '../services/event-permit.service';

  @Component({
    selector: 'app-event-review',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './event-review.component.html',
    styleUrls: ['./event-review.component.css']
  })
  export class EventReviewComponent {
    eventDates: any[] = [];
    uploadedFiles: File[] = [];

    constructor(
      private router: Router,
      private http: HttpClient,
      public permitService: EventPermitService
    ) {

      this.eventDates = this.permitService.getEventDates() || [];
      this.uploadedFiles = this.permitService.getUploadedFiles() || [];
    }

    goBack() {
      this.router.navigate(['/additional-forms']);
    }

    submitForm() {
      const permitInfo = this.permitService.getBasicInfo();
      permitInfo.permit_type = this.permitService.getPermitType();
      permitInfo.additional_notes = this.permitService.getNotes();
    
      const payload = {
        event_permit: permitInfo,
        slots: this.permitService.getEventDates(),
        documents: this.permitService.getUploadedFiles(),
      };
    
      this.http.post('http://localhost:8080/event-permits/submit', payload, {
        withCredentials: true
      }).subscribe({
        next: (res) => {
          alert('Permit submitted successfully!');
          this.router.navigate(['/thank-you']);
        },
        error: (err) => {
          console.error('Submission failed:', err);
          alert('Submission failed. Please try again.');
        }
      });
    }         
  }