import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregationGraphComponent } from './aggregation-graph.component';

describe('AggregationGraphComponent', () => {
  let component: AggregationGraphComponent;
  let fixture: ComponentFixture<AggregationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggregationGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
