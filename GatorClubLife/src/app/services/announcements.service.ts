import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private announcementsSubject = new BehaviorSubject<any[]>([]);
  announcements$ = this.announcementsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch all announcements from the backend
  fetchAnnouncements(): void {
    const url = 'http://localhost:8080/announcements';  // Your backend API URL
    this.http.get<any[]>(url).subscribe((data) => {
      this.announcementsSubject.next(data);
    });
  }

  // Post a new announcement to the backend
  postAnnouncement(announcement: any): void {
    const url = 'http://localhost:8080/announcements/create';  // Your backend API URL
    this.http.post(url, announcement).subscribe(() => {
      this.fetchAnnouncements();  // Refresh the announcements after posting
    });
  }

  // Refresh the announcements list
  refreshAnnouncements(): void {
    this.fetchAnnouncements();  // Fetch the latest announcements
  }
}
