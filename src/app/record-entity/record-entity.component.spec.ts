import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordEntityComponent } from './record-entity.component';

describe('RecordEntityComponent', () => {
  let component: RecordEntityComponent;
  let fixture: ComponentFixture<RecordEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
