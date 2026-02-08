import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should switch tabs', () => {
    component.switchTab('events');
    expect(component.activeTab).toBe('events');
  });

  it('should approve permits correctly', () => {
    component.permits = [{ id: 1, event: 'X', submittedBy: 'Y', status: 'Pending' }];
    component.approvePermit(1);
    expect(component.permits[0].status).toBe('Approved');
  });

  it('should toggle maintenance mode', () => {
    component.maintenanceMode = false;
    component.toggleMaintenance();
    expect(component.maintenanceMode).toBeTrue();
  });

  it('should add a new category', () => {
    component.categories = ['Music'];
    component.addCategory('Sports');
    expect(component.categories.includes('Sports')).toBeTrue();
  });
});
