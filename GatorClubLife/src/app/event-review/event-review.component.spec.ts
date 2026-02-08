import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventReviewComponent } from './event-review.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventPermitService } from '../services/event-permit.service';

describe('EventReviewComponent', () => {
  let component: EventReviewComponent;
  let fixture: ComponentFixture<EventReviewComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPermitService: jasmine.SpyObj<EventPermitService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPermitService = jasmine.createSpyObj('EventPermitService', [
      'getBasicInfo',
      'getPermitType',
      'getNotes',
      'getEventDates',
      'getUploadedFiles'
    ]);

    mockPermitService.getBasicInfo.and.returnValue({
      event_name: 'Mock Event',
      event_description: 'Description here',
      expected_attendance: 100,
      event_categories: ['MockCategory']
    });
    mockPermitService.getPermitType.and.returnValue('general');
    mockPermitService.getNotes.and.returnValue('Some notes');
    mockPermitService.getEventDates.and.returnValue([
      { start_time: '2025-04-21', end_time: '2025-04-21' }
    ]);
    mockPermitService.getUploadedFiles.and.returnValue([
      new File([''], 'testfile.pdf', { type: 'application/pdf' })
    ]);

    await TestBed.configureTestingModule({
      imports: [EventReviewComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EventPermitService, useValue: mockPermitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when goBack() is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/additional-forms']);
  });

  it('should make a submission request and navigate on success', () => {
    const http = TestBed.inject(HttpTestingController);
    spyOn(window, 'alert'); // prevent actual alerts from showing

    component.submitForm();

    const req = http.expectOne('http://localhost:8080/event-permits/submit');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });

    expect(window.alert).toHaveBeenCalledWith('Permit submitted successfully!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/thank-you']);
  });

  it('should alert and log error on submission failure', () => {
    const http = TestBed.inject(HttpTestingController);
    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.submitForm();

    const req = http.expectOne('http://localhost:8080/event-permits/submit');
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Submission failed. Please try again.');
  });
});
