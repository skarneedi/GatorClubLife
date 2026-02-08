import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser'; // For DOM element selection
import { DebugElement } from '@angular/core'; // For DebugElement
import { of } from 'rxjs';  // Used for mocking observables

describe('AppComponent (Dropdown)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        {
          provide: 'AuthService',
          useValue: {
            isLoggedIn$: of(true),
            userInfo$: of({ name: 'John Doe' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the dropdown visibility when clicked', () => {
    // Initial state: dropdown should be hidden
    expect(component.showDropdown).toBeFalse();

    // Trigger the toggleDropdown method directly
    component.toggleDropdown(new MouseEvent('click'));
    fixture.detectChanges(); // Trigger change detection

    // After the first click: dropdown should be visible
    expect(component.showDropdown).toBeTrue();

    // Simulate another click to toggle the dropdown off
    component.toggleDropdown(new MouseEvent('click'));
    fixture.detectChanges(); // Trigger change detection again

    // After the second click: dropdown should be hidden
    expect(component.showDropdown).toBeFalse();
  });

  it('should hide the dropdown when clicking outside', () => {
    // Ensure initial state is dropdown visible
    component.showDropdown = true;
    fixture.detectChanges();

    // Simulate clicking outside the dropdown
    const documentClickEvent = new MouseEvent('click', { bubbles: true });
    document.body.dispatchEvent(documentClickEvent);
    fixture.detectChanges(); // Trigger change detection after the outside click

    // After clicking outside: dropdown should be hidden
    expect(component.showDropdown).toBeFalse();
  });
});
