import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementsComponent } from './announcements.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;

  const mockAuthService = {
    userInfo$: of({ name: 'Test User', email: 'test@example.com', role: 'admin' }) // ✅ simulate admin login
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;

    // ✅ Provide some mock data
    component.announcements = [
      {
        id: 1,
        title: 'Club Meeting',
        content: 'We will discuss plans.',
        date: new Date().toISOString(),
        expanded: false
      },
      {
        id: 2,
        title: 'Event Reminder',
        content: 'Join the fun!',
        date: new Date().toISOString(),
        expanded: false
      }
    ];

    component.filteredAnnouncements = [...component.announcements];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expanded state on toggleExpand()', () => {
    expect(component.filteredAnnouncements[0].expanded).toBeFalse();
    component.toggleExpand(1);
    expect(component.filteredAnnouncements[0].expanded).toBeTrue();
  });

  it('should filter announcements based on search term', () => {
    component.searchTerm = 'Reminder';
    component.filterAnnouncements();
    expect(component.filteredAnnouncements.length).toBe(1);
    expect(component.filteredAnnouncements[0].title).toContain('Reminder');
  });

  it('should reset filteredAnnouncements to all when search is empty', () => {
    component.searchTerm = '';
    component.filterAnnouncements();
    expect(component.filteredAnnouncements.length).toBe(2);
  });
});
