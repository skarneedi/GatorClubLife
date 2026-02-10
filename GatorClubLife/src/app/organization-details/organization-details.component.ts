import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ButtonComponent } from '../shared/components/button/button.component';
import { CardComponent } from '../shared/components/card/card.component';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
})
export class OrganizationDetailsComponent implements OnInit {
  organizationId: string | null = null;
  organization: any = {};
  announcements: any[] = [];
  events: any[] = [];
  officers: any[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const orgId = this.route.snapshot.paramMap.get('id');
    this.organizationId = orgId;
    const baseUrl = 'http://localhost:8080';
    console.log("📌 Organization ID from route:", orgId);

    if (orgId) {
      // Fetch Organization Details
      this.http.get(`${baseUrl}/clubs/${orgId}`, { withCredentials: true }).subscribe({
        next: (data: any) => {
          this.organization = {
            name: data.club_name,
            description: data.club_description,
            category: data.club_category || 'Student Organization', // Mock category if missing
            image: `https://ui-avatars.com/api/?name=${data.club_name}&background=random&size=200` // Mock image
          };
          this.isLoading = false;
        },
        error: (err) => {
          console.error("❌ Error fetching organization:", err);
          // Mock Data Fallback
          this.organization = {
            name: 'Gator Robotics',
            description: 'Building autonomous robots for competition and research. Join our team to learn engineering, coding, and teamwork skills!',
            category: 'Academic',
            image: 'https://ui-avatars.com/api/?name=Gator+Robotics&background=00529b&color=fff&size=200'
          };
          this.isLoading = false;
        }
      });

      // Fetch Officers
      this.http.get(`${baseUrl}/clubs/${orgId}/officers`, { withCredentials: true }).subscribe({
        next: (data: any) => {
          this.officers = data.map((officer: any) => ({
            name: officer.officer_name,
            role: officer.officer_role
          }));
        },
        error: (err) => {
          // Mock Officers
          this.officers = [
            { name: 'Alice Gator', role: 'President' },
            { name: 'Bob Swamp', role: 'Vice President' },
            { name: 'Charlie Croc', role: 'Treasurer' }
          ];
        }
      });

      // Fetch Announcements
      this.http.get(`${baseUrl}/announcements?club_id=${orgId}`, { withCredentials: true }).subscribe({
        next: (data: any) => this.announcements = data,
        error: (err) => {
          this.announcements = [
            { announcement_title: 'Welcome Back!', announcement_message: 'First general meeting is next Tuesday.' }
          ];
        }
      });

      // Fetch Events
      this.http.get(`${baseUrl}/events?club_id=${orgId}`, { withCredentials: true }).subscribe({
        next: (data: any) => this.events = data,
        error: (err) => {
          this.events = [
            { event_name: 'Robot War 2025', event_description: 'Annual bot battle.', event_date: '2025-04-15' },
            { event_name: 'Coding Workshop', event_description: 'Learn Python basics.', event_date: '2025-04-20' }
          ];
        }
      });

    } else {
      console.error("❌ No organization ID found in route.");
      this.isLoading = false;
    }
  }
}
