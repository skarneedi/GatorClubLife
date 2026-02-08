import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-permits',
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.css'],
})
export class PermitsComponent {
  constructor(
    private router: Router,
    private permitService: EventPermitService
  ) {}

  // Navigates to the first step and stores selected permit type
  navigateToForm(permitType: string): void {
    console.log(`Navigating to /forms/${permitType}...`);
    this.permitService.setPermitType(permitType);
    this.router.navigate(['/forms', permitType]);
  }  
}