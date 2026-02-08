import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // ✅ Use 'imports' instead of 'declarations' for standalone components
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the About component', () => {
    expect(component).toBeTruthy();
  });

  it('should render heading text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('About GatorClubLife');
  });

  it('should render description paragraphs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const paragraphs = compiled.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(paragraphs[0].textContent).toContain('Welcome to GatorClubLife');
  });
});
