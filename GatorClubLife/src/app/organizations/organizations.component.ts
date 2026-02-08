// src/app/organizations/organizations.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-organizations',
  standalone: true,
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule], // Add RouterModule here
})
export class OrganizationsComponent implements OnInit {
  clubs: any[] = [];
  filteredOrganizations: any[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchClubs();
  }

  fetchClubs() {
    this.http.get<any[]>('http://localhost:8080/clubs').subscribe({
      next: (data) => {
        this.clubs = data;
        this.extractCategories();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching clubs:', err);
      },
    });
  }

  extractCategories() {
    const categorySet = new Set<string>();
    this.clubs.forEach((club) => {
      if (club.club_category) {
        categorySet.add(club.club_category);
      }
    });
    this.categories = Array.from(categorySet);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredOrganizations = this.clubs.filter((club) => {
      const matchesCategory =
        !this.selectedCategory || club.club_category === this.selectedCategory;

      const matchesSearch =
        !this.searchTerm ||
        club.club_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        club.club_description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    console.log('[Filtered Clubs]:', this.filteredOrganizations);
  }
}