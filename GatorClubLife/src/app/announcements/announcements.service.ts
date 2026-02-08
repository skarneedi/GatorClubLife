import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';  // Adjust based on your project setup

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private announcementsSubject = new BehaviorSubject<any[]>([]);  // Store the announcements
  announcements$ = this.announcementsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch all announcements from the backend
  fetchAnnouncements(): void {
    const url = `${environment.apiBaseUrl}/announcements`;  // Adjust with your backend API URL
    this.http.get<any[]>(url, { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.announcementsSubject.next(data);  // Update the announcements list
        },
        error: (err) => console.error('Error fetching announcements:', err)
      });
  }

  // Post a new announcement to the backend
  postAnnouncement(announcement: any): void {
    const url = `${environment.apiBaseUrl}/announcements/create`;  // Adjust with your backend URL
    this.http.post(url, announcement, { withCredentials: true })
      .subscribe({
        next: (newAnnouncement) => {
          // After posting, refresh the announcements list
          this.fetchAnnouncements();
        },
        error: (err) => console.error('Error posting announcement:', err)
      });
  }

  // Refresh the announcements list (e.g., after a new announcement is posted)
  refreshAnnouncements(): void {
    this.fetchAnnouncements();  // Fetch the latest announcements
  }
}
