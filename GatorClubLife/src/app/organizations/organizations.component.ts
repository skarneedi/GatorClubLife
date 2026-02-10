import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../shared/components/card/card.component';
import { ButtonComponent } from '../shared/components/button/button.component';

interface Club {
  club_id: number;
  club_name: string;
  club_description: string;
  club_category: string;
  image?: string;
  memberCount?: number;
}

@Component({
  selector: 'app-organizations',
  standalone: true,
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, CardComponent, ButtonComponent],
})
export class OrganizationsComponent implements OnInit {
  clubs: Club[] = [];
  filteredOrganizations: Club[] = [];
  categories: string[] = ['All', 'Academic', 'Arts & Performance', 'Sports', 'Service', 'Cultural'];
  selectedCategory: string = 'All';
  searchTerm: string = '';
  isLoading = true;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadClubs();
  }

  loadClubs() {
    this.isLoading = true;

    // Mock Data for immediate UI verification
    const mockClubs: Club[] = [
      { club_id: 1, club_name: 'Gator Robotics', club_description: 'Building autonomous robots for competition and research.', club_category: 'Academic', image: 'robotics-club', memberCount: 42 },
      { club_id: 2, club_name: 'Debate Team', club_description: 'National championship debate team practicing argumentation.', club_category: 'Academic', image: 'debate-club', memberCount: 28 },
      { club_id: 3, club_name: 'Chess Club', club_description: 'Competitive and casual chess for all skill levels.', club_category: 'Sports', image: 'chess-club', memberCount: 55 },
      { club_id: 4, club_name: 'Photography Society', club_description: 'Capture the moment. Weekly photo walks and workshops.', club_category: 'Arts & Performance', image: 'photo-club', memberCount: 80 },
      { club_id: 5, club_name: 'Running Club', club_description: 'Train for marathons or just jog for fitness with us.', club_category: 'Sports', image: 'running-club', memberCount: 120 },
      { club_id: 6, club_name: 'Volunteer UF', club_description: 'Connecting students with community service opportunities.', club_category: 'Service', image: 'volunteer-club', memberCount: 200 },
      { club_id: 7, club_name: 'Asian Student Union', club_description: 'Celebrating Asian culture through events and advocacy.', club_category: 'Cultural', image: 'asu-club', memberCount: 150 },
    ];

    this.http.get<Club[]>('http://localhost:8080/clubs').subscribe({
      next: (data) => {
        // Merge mock data if backend has few items (for demo purposes)
        this.clubs = data.length > 0 ? data : mockClubs;
        // Ensure mock data is used if data is empty or for demo
        if (this.clubs.length === 0) this.clubs = mockClubs;

        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching clubs, using mock data:', err);
        this.clubs = mockClubs;
        this.applyFilters();
        this.isLoading = false;
      },
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredOrganizations = this.clubs.filter((club) => {
      const matchesCategory =
        this.selectedCategory === 'All' || club.club_category === this.selectedCategory;

      const matchesSearch =
        !this.searchTerm ||
        club.club_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        club.club_description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }
}