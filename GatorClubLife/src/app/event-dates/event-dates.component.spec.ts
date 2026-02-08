import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDatesComponent } from './event-dates.component';
import { Router } from '@angular/router';
import { EventPermitService } from '../services/event-permit.service';

describe('EventDatesComponent', () => {
  let component: EventDatesComponent;
  let fixture: ComponentFixture<EventDatesComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPermitService: jasmine.SpyObj<EventPermitService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPermitService = jasmine.createSpyObj('EventPermitService', ['setSlots', 'getPermitType']);
    mockPermitService.getPermitType.and.returnValue('basicInfo');

    await TestBed.configureTestingModule({
      imports: [EventDatesComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EventPermitService, useValue: mockPermitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EventDatesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should add an event manually and update calendar', () => {
    const initialLength = component.calendarEvents.length;
    spyOn(window, 'prompt').and.returnValues('Test Event', '2025-04-21', '2025-04-21');

    component.addEvent();

    expect(component.calendarEvents.length).toBe(initialLength + 1);
    expect(component.calendarEvents[0].title).toBe('Test Event');
  });

  it('should navigate back with correct route', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forms', 'basicInfo']);
  });

  it('should set slots and go to next page', () => {
    component.calendarEvents = [
      { title: 'Demo', start: '2025-04-21', end: '2025-04-21' }
    ];

    component.goToNextPage();

    expect(mockPermitService.setSlots).toHaveBeenCalledWith([
      { start_time: '2025-04-21', end_time: '2025-04-21' }
    ]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/additional-forms']);
  });
});
