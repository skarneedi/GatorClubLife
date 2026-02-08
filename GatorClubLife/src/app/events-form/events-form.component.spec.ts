import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsFormComponent } from './events-form.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EventPermitService } from '../services/event-permit.service';

describe('EventsFormComponent', () => {
  let component: EventsFormComponent;
  let fixture: ComponentFixture<EventsFormComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPermitService: jasmine.SpyObj<EventPermitService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPermitService = jasmine.createSpyObj('EventPermitService', ['setBasicInfo']);

    await TestBed.configureTestingModule({
      imports: [EventsFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        { provide: EventPermitService, useValue: mockPermitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EventsFormComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle category selection', () => {
    const cat = 'TABLING';
    expect(component.isSelected(cat)).toBeFalse();
    component.toggleCategory(cat);
    expect(component.isSelected(cat)).toBeTrue();
    component.toggleCategory(cat);
    expect(component.isSelected(cat)).toBeFalse();
  });

  it('should NOT proceed if form is incomplete', () => {
    spyOn(window, 'alert'); // mock alert

    component.eventName = '';
    component.eventPurpose = '';
    component.expectedAttendance = 0;
    component.selectedCategories = [];

    component.goToEventDates();

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields before continuing.');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should save info and navigate if form is valid', () => {
    component.eventName = 'Test Event';
    component.eventPurpose = 'A cool purpose';
    component.expectedAttendance = 100;
    component.selectedCategories = ['TABLING'];

    component.goToEventDates();

    expect(mockPermitService.setBasicInfo).toHaveBeenCalledWith({
      event_name: 'Test Event',
      event_description: 'A cool purpose',
      expected_attendance: 100,
      event_categories: 'TABLING'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dates']);
  });
});
