import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PublicComponent } from './public.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PublicComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PublicComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'silloker-web'`, () => {
    const fixture = TestBed.createComponent(PublicComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('silloker-web');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(PublicComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('silloker-web app is running!');
  });
});
