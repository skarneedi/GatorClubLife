import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class OrganizationDetailsComponent implements OnInit {
  organizationId: string | null = null;
  organization: any = {};
  announcements: any[] = [];
  events: any[] = [];
  officers: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const orgId = this.route.snapshot.paramMap.get('id');
    const baseUrl = 'http://localhost:8080';
    console.log("📌 Organization ID from route:", orgId);
  
    if (orgId) {
      this.http.get(`${baseUrl}/clubs/${orgId}`, { withCredentials: true }).subscribe({
        next: (data: any) => {
          console.log("✅ Organization Data:", data);
          this.organization = {
            name: data.club_name,
            description: data.club_description
          };
        },
        error: (err) => console.error("❌ Error fetching organization:", err)
      });
  
      this.http.get(`${baseUrl}/clubs/${orgId}/officers`, {
        withCredentials: true
      }).subscribe({
        next: (data: any) => {
          console.log("✅ Officers Data:", data);
          this.officers = data.map((officer: any) => ({
            name: officer.officer_name,
            role: officer.officer_role
          }));
        },
        error: (err) => console.error("❌ Error fetching officers:", err)
      });
  
      this.http.get(`${baseUrl}/announcements?club_id=${orgId}`, {
        withCredentials: true
      }).subscribe({
        next: (data: any) => {
          console.log("✅ Announcements Data:", data);
          this.announcements = data;
        },
        error: (err) => console.error("❌ Error fetching announcements:", err)
      });
  
      this.http.get(`${baseUrl}/events?club_id=${orgId}`, {
        withCredentials: true
      }).subscribe({
        next: (data: any) => {
          console.log("✅ Events Data:", data);
          this.events = data;
        },
        error: (err) => console.error("❌ Error fetching events:", err)
      });
    } else {
      console.error("❌ No organization ID found in route.");
    }
  }  
}
