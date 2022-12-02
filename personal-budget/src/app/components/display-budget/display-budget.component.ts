import { Component, Input } from '@angular/core';
import { Budget } from 'src/data/budget';

@Component({
  selector: 'app-display-budget',
  templateUrl: './display-budget.component.html',
  styleUrls: ['./display-budget.component.css']
})
export class DisplayBudgetComponent {
  @Input() budget: Budget = new Budget(0, '', 0, 0)
}
