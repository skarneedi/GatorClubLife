import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationsComponent } from './organizations.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrganizationsComponent (UI logic tests)', () => {
  let component: OrganizationsComponent;
  let fixture: ComponentFixture<OrganizationsComponent>;

  const mockClubs = [
    {
      club_id: 1,
      club_name: 'AI Explorers',
      club_description: 'A club for students interested in artificial intelligence and machine learning.',
      club_category: 'STEM & Innovation'
    },
    {
      club_id: 2,
      club_name: 'Pre-Law Society',
      club_description: 'Supporting students pursuing careers in law through workshops, networking, and LSAT prep.',
      club_category: 'Professional & Career'
    },
    {
      club_id: 3,
      club_name: 'Robotics Club',
      club_description: 'A club for students interested in robotics, AI, and Machine Learning.',
      club_category: 'STEM & Innovation'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrganizationsComponent,
        RouterTestingModule // ✅ Real router testing support
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationsComponent);
    component = fixture.componentInstance;

    // ✅ Set mock data manually
    component.clubs = mockClubs;
    component.extractCategories();
    component.applyFilters();

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all clubs when no filters applied', () => {
    expect(component.filteredOrganizations.length).toBe(3);
  });

  it('should filter by category (STEM & Innovation)', () => {
    component.selectCategory('STEM & Innovation');
    expect(component.filteredOrganizations.length).toBe(2);
    expect(component.filteredOrganizations[0].club_name).toBe('AI Explorers');
  });

  it('should filter by search (e.g., "law")', () => {
    component.searchTerm = 'law';
    component.applyFilters();
    expect(component.filteredOrganizations.length).toBe(1);
    expect(component.filteredOrganizations[0].club_name).toBe('Pre-Law Society');
  });

  it('should return nothing if filters don’t match', () => {
    component.selectedCategory = 'Academic & Research';
    component.searchTerm = 'Robotics';
    component.applyFilters();
    expect(component.filteredOrganizations.length).toBe(0);
  });
});
