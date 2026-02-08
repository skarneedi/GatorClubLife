import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySubmissionsComponent } from './my-submissions.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth.service';

describe('MySubmissionsComponent', () => {
  let component: MySubmissionsComponent;
  let fixture: ComponentFixture<MySubmissionsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySubmissionsComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MySubmissionsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ✅ ensures no unflushed requests
  });

  it('should create the component', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8080/submissions');
    req.flush([]); // respond with empty permit list

    expect(component).toBeTruthy();
  });

  it('should set activeTab correctly', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8080/submissions');
    req.flush([]); // flush dummy response

    component.setActiveTab('test-tab');
    expect(component.activeTab).toBe('test-tab');
  });

  it('should load permit data from the API', () => {
    const mockPermits = [
      { id: 1, event_name: 'Test Event', submitted_by: 'test@ufl.edu', slot_count: 2, status: 'pending' }
    ];

    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8080/submissions');
    expect(req.request.method).toBe('GET');
    req.flush(mockPermits);

    expect(component.myPermits.length).toBe(1);
    expect(component.myPermits[0].event_name).toBe('Test Event');
  });
});
