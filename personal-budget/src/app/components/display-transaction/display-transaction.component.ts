import { Component, Input } from '@angular/core';
import { Transaction } from 'src/data/transaction';

@Component({
  selector: 'app-display-transaction',
  templateUrl: './display-transaction.component.html',
  styleUrls: ['./display-transaction.component.css']
})
export class DisplayTransactionComponent {
  @Input() transaction: Transaction = {} as Transaction
}
