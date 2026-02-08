import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventsComponent,
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close modal correctly', () => {
    const event = component.events[0];
    component.openModal(event);
    expect(component.showModal).toBeTrue();
    expect(component.selectedEvent).toEqual(event);
    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should RSVP and undo RSVP', () => {
    const event = component.events[0];
    component.openModal(event);
    component.userEmail = 'test@ufl.edu';

    component.rsvpToEvent();
    expect(event.rsvped).toBeTrue();

    component.undoRSVP();
    expect(event.rsvped).toBeFalse();
  });
});
