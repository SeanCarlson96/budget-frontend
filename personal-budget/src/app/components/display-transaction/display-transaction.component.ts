import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { UiService } from 'src/app/services/ui.service';
import { strTransaction } from 'src/data/strTransaction';
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-display-transaction',
  templateUrl: './display-transaction.component.html',
  styleUrls: ['./display-transaction.component.css']
})
export class DisplayTransactionComponent implements OnInit {
  ui: UiService
  displayedColumns: string[] = ['id', 'amount', 'partyName', 'accountName', 'budgetName'];
  dataInfo: strTransaction[] = []
  dataSource = new MatTableDataSource(this.dataInfo)
  subscription: any
  @ViewChild(MatSort) matSort! : MatSort

  constructor(ui:UiService){
    this.ui = ui
  }
  ngOnInit() {
    this.subscription = this.ui.getEmittedTransactions().subscribe(item => {
      this.dataSource.data = item
      this.dataSource.sort = this.matSort
    })
  }
}