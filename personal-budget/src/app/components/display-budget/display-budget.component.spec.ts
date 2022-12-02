import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayBudgetComponent } from './display-budget.component';

describe('DisplayBudgetComponent', () => {
  let component: DisplayBudgetComponent;
  let fixture: ComponentFixture<DisplayBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
