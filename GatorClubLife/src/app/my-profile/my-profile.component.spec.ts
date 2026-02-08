import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileComponent } from './my-profile.component';
import { AuthService, UserInfo } from '../auth.service';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: UserInfo = {
    id: 1,
    name: 'Test User',
    email: 'user@ufl.edu',
    role: 'member',
    joined: '2023-01-01',
    phone: '1234567890',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserDetails', 'setUser']);
    mockAuthService.getUserDetails.and.returnValue({ ...mockUser }); // clone to avoid reference mutation

    await TestBed.configureTestingModule({
      imports: [MyProfileComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the my-profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details on init and set editablePhone', () => {
    component.ngOnInit(); // explicitly run ngOnInit
    expect(component.user?.email).toBe('user@ufl.edu');
    expect(component.editablePhone).toBe('1234567890');
  });

  it('should toggle edit mode', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should update phone number and call setUser on saveChanges()', () => {
    component.user = { ...mockUser }; // simulate preloaded user
    component.editablePhone = '9876543210';
    component.isEditing = true;

    component.saveChanges();

    expect(component.user.phone).toBe('9876543210');
    expect(mockAuthService.setUser).toHaveBeenCalledWith(jasmine.objectContaining({
      phone: '9876543210'
    }));
    expect(component.isEditing).toBeFalse();
  });
});
