import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventsComponent } from './my-events.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventsComponent, FormsModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show all events when "All" category is selected', () => {
    component.selectedCategory = 'All';
    component.applyFilters();
    expect(component.filteredEvents.length).toBe(component.events.length);
  });

  it('should filter events by category', () => {
    component.selectedCategory = 'Workshop';
    component.applyFilters();
    expect(component.filteredEvents.every(e => e.category === 'Workshop')).toBeTrue();
  });

  it('should filter events by search term', () => {
    component.searchTerm = 'Music';
    component.applyFilters();
    expect(component.filteredEvents.some(e => e.title.includes('Music'))).toBeTrue();
  });

  it('should toggle favorite status correctly', () => {
    const original = component.events.find(e => e.id === 1)?.isFavorite;
    component.toggleFavorite(1);
    const updated = component.events.find(e => e.id === 1)?.isFavorite;
    expect(updated).toBe(!original);
  });
});
