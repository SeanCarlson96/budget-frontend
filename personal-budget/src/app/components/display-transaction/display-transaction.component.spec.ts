import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTransactionComponent } from './display-transaction.component';

describe('DisplayTransactionComponent', () => {
  let component: DisplayTransactionComponent;
  let fixture: ComponentFixture<DisplayTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayTransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
