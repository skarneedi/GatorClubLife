import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, TitleCasePipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgClass,
    TitleCasePipe
  ]
})
export class MySubmissionsComponent implements OnInit {
  activeTab = 'my-permits';
  myPermits: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMyPermits();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  loadMyPermits() {
    this.http.get<any[]>('http://localhost:8080/submissions', {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        console.log("Loaded permits:", data);
        this.myPermits = data;
      },
      error: (err) => {
        console.error('Failed to load permits:', err);
      }
    });
  }
}