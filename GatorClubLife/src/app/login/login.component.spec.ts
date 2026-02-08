import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['setUser']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should reject non-UFL email addresses', () => {
    component.username = 'test@gmail.com';
    component.login();
    expect(component.emailError).toBe('Please use a valid UF email (e.g., user@ufl.edu).');
  });

  it('should navigate to register page on goToRegister()', () => {
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should call setUser and navigate if login succeeds', () => {
    const mockResponse = {
      user_id: 1,
      user_name: 'Test User',
      user_email: 'user@ufl.edu',
      user_role: 'member',
      user_created_at: 1713705600 // Example timestamp
    };

    component.username = 'user@ufl.edu';
    component.password = 'test123';

    spyOn(component['http'], 'post').and.returnValue(of(mockResponse));

    component.login();

    expect(mockAuthService.setUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
