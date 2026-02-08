import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-additional-forms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './additional-forms.component.html',
  styleUrls: ['./additional-forms.component.css']
})
export class AdditionalFormsComponent {
  notes: string = '';

  constructor(
    private router: Router,
    private permitService: EventPermitService
  ) {}

  handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const fileList = Array.from(input.files);
      this.permitService.setUploadedFiles(fileList);
      console.log("📁 Uploaded files set:", fileList);
    }
  }

  goBack() {
    this.router.navigate(['/dates']);
  }

  goToNextPage() {
    this.permitService.setNotes(this.notes);
    this.router.navigate(['/review']);
  }
}
