import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalFormsComponent } from './additional-forms.component';
import { Router } from '@angular/router';
import { EventPermitService } from '../services/event-permit.service';

describe('AdditionalFormsComponent', () => {
  let component: AdditionalFormsComponent;
  let fixture: ComponentFixture<AdditionalFormsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPermitService: jasmine.SpyObj<EventPermitService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPermitService = jasmine.createSpyObj('EventPermitService', ['setUploadedFiles', 'setNotes']);

    await TestBed.configureTestingModule({
      imports: [AdditionalFormsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: EventPermitService, useValue: mockPermitService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AdditionalFormsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when goBack() is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dates']);
  });

  it('should set notes and navigate to /review when goToNextPage() is called', () => {
    component.notes = 'Test notes';
    component.goToNextPage();
    expect(mockPermitService.setNotes).toHaveBeenCalledWith('Test notes');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/review']);
  });

  it('should call setUploadedFiles when handleFileUpload is triggered', () => {
    const fakeFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const inputEvent = {
      target: {
        files: [fakeFile]
      }
    } as unknown as Event;

    component.handleFileUpload(inputEvent);
    expect(mockPermitService.setUploadedFiles).toHaveBeenCalledWith([fakeFile]);
  });
});
