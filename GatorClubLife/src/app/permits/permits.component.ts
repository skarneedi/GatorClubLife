import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Added RouterModule for routerLink
import { CommonModule } from '@angular/common'; // Added CommonModule for *ngFor
import { EventPermitService } from '../services/event-permit.service';
import { CardComponent } from '../shared/components/card/card.component';
import { ButtonComponent } from '../shared/components/button/button.component';

interface PermitType {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji for now, could be icon class later
  category: 'BA' | 'SG'; // Business Affairs vs Student Gov
}

@Component({
  selector: 'app-permits',
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent],
})
export class PermitsComponent {

  permitTypes: PermitType[] = [
    {
      id: 'general-events',
      title: 'General Event Permit',
      description: 'Required for most on-campus gatherings, meetings, and social events. Includes requests to serve food/alcohol.',
      icon: '📅',
      category: 'BA'
    },
    {
      id: 'tabling',
      title: 'Tabling Permit',
      description: 'Reserve a table at Turlington, Plaza of the Americas, or Reitz Union breezeway.',
      icon: '📝',
      category: 'BA'
    },
    {
      id: 'banner-permit',
      title: 'Banner Permit',
      description: 'Request permission to hang banners at designated campus locations.',
      icon: '🚩',
      category: 'BA'
    },
    {
      id: 'century-tower-lighting',
      title: 'Century Tower Lighting',
      description: 'Request special lighting colors for the Century Tower to commemorate an event or cause.',
      icon: '💡',
      category: 'BA'
    },
    {
      id: 'run-walk',
      title: 'Run / Walk Permit',
      description: 'Organize a 5K, charity walk, or biking event on campus roads/paths.',
      icon: '🏃',
      category: 'BA'
    },
    {
      id: 'yard-sign',
      title: 'Yard Signs & Feathers',
      description: 'Placing temporary directional or promotional signage on campus grounds.',
      icon: '🪧',
      category: 'BA'
    },
    {
      id: 'select-spaces',
      title: 'Select Spaces (Alcohol)',
      description: 'Specific request for serving alcohol in pre-approved Select Space venues.',
      icon: '🍷',
      category: 'BA'
    }
  ];

  constructor(
    private router: Router,
    private permitService: EventPermitService
  ) { }

  navigateToForm(permitType: string): void {
    console.log(`Navigating to /forms/${permitType}...`);
    this.permitService.setPermitType(permitType);
    this.router.navigate(['/forms', permitType]);
  }
}