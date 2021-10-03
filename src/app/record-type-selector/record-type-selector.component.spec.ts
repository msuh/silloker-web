import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordTypeSelectorComponent } from './record-type-selector.component';

describe('RecordTypeSelectorComponent', () => {
  let component: RecordTypeSelectorComponent;
  let fixture: ComponentFixture<RecordTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordTypeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
