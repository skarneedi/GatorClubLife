import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationDetailsComponent } from './organization-details.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('OrganizationDetailsComponent', () => {
  let component: OrganizationDetailsComponent;
  let fixture: ComponentFixture<OrganizationDetailsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationDetailsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '123'  // mock organization ID
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationDetailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the organization details component', () => {
    // ✅ Flush all 4 requests triggered on init
    httpMock.expectOne('http://localhost:8080/clubs/123').flush({ club_name: 'Mock Club', club_description: 'Description here' });
    httpMock.expectOne('http://localhost:8080/clubs/123/officers').flush([]);
    httpMock.expectOne('http://localhost:8080/announcements?club_id=123').flush([]);
    httpMock.expectOne('http://localhost:8080/events?club_id=123').flush([]);

    expect(component).toBeTruthy();
  });

  it('should populate component fields from the API', () => {
    // Flush responses for all 4 requests
    httpMock.expectOne('http://localhost:8080/clubs/123').flush({ club_name: 'Chess Club', club_description: 'Play & Learn' });
    httpMock.expectOne('http://localhost:8080/clubs/123/officers').flush([
      { officer_name: 'Alice', officer_role: 'President' }
    ]);
    httpMock.expectOne('http://localhost:8080/announcements?club_id=123').flush([
      { announcement_title: 'Meeting', announcement_message: 'Join us Monday' }
    ]);
    httpMock.expectOne('http://localhost:8080/events?club_id=123').flush([
      { event_name: 'Chess Night', event_description: 'Friendly matches' }
    ]);

    expect(component.organization.name).toBe('Chess Club');
    expect(component.officers.length).toBe(1);
    expect(component.announcements.length).toBe(1);
    expect(component.events.length).toBe(1);
  });
});
