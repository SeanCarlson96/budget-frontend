import { Component, Input, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { strTransaction } from 'src/data/strTransaction';
import { Transaction } from 'src/data/transaction';

@Component({
  selector: 'app-display-transaction',
  templateUrl: './display-transaction.component.html',
  styleUrls: ['./display-transaction.component.css']
})
export class DisplayTransactionComponent implements OnInit {
  ui: UiService
  displayedColumns: string[] = ['id', 'amount', 'party', 'account', 'budget'];
  dataSource: strTransaction[] = []
  subscription: any

  constructor(ui:UiService){
    this.ui = ui
  }
  ngOnInit() {
    this.subscription = this.ui.getEmittedTransactions().subscribe(item => this.dataSource=item);
  }
}