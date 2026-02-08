import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermitsComponent } from './permits.component';
import { Router } from '@angular/router';
import { EventPermitService } from '../services/event-permit.service';

describe('PermitsComponent', () => {
  let component: PermitsComponent;
  let fixture: ComponentFixture<PermitsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPermitService: jasmine.SpyObj<EventPermitService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPermitService = jasmine.createSpyObj('EventPermitService', ['setPermitType']);

    await TestBed.configureTestingModule({
      imports: [PermitsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EventPermitService, useValue: mockPermitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setPermitType and navigate on navigateToForm()', () => {
    const permitType = 'banner-permit';
    component.navigateToForm(permitType);

    expect(mockPermitService.setPermitType).toHaveBeenCalledWith(permitType);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/forms', permitType]);
  });
});
