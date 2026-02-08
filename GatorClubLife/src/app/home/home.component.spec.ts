import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and populate latest announcements', () => {
    const mockAnnouncements = [
      {
        announcement_title: 'Welcome Back!',
        announcement_message: 'Spring semester begins!',
        announcement_created_at: '2025-04-01T12:00:00Z'
      }
    ];

    const req = httpMock.expectOne('http://localhost:8080/announcements');
    req.flush(mockAnnouncements);

    expect(component.latestAnnouncements.length).toBe(1);
    expect(component.latestAnnouncements[0].title).toBe('Welcome Back!');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error message on API failure', () => {
    const req = httpMock.expectOne('http://localhost:8080/announcements');
    req.flush('Failed', { status: 500, statusText: 'Error' });

    expect(component.errorMessage).toBe('Could not load announcements.');
    expect(component.latestAnnouncements.length).toBe(0);
    expect(component.isLoading).toBeFalse();
  });

  it('should have 3 upcoming events', () => {
    expect(component.upcomingEvents.length).toBe(3);
  });

  it('should have 4 popular clubs', () => {
    expect(component.popularClubs.length).toBe(4);
  });
});
