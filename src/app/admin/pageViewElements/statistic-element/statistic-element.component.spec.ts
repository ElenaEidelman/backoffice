import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticElementComponent } from './statistic-element.component';

describe('StatisticElementComponent', () => {
  let component: StatisticElementComponent;
  let fixture: ComponentFixture<StatisticElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
