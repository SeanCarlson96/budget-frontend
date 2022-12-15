import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { UiService } from 'src/app/services/ui.service';
import { strTransaction } from 'src/data/strTransaction';
import { MatTableDataSource } from '@angular/material/table'
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-transaction',
  templateUrl: './display-transaction.component.html',
  styleUrls: ['./display-transaction.component.css']
})
export class DisplayTransactionComponent implements OnInit, OnDestroy {
  ui: UiService
  displayedColumns: string[] = [ 'amount', 'partyName', 'accountName', 'budgetName']
  dataInfo: strTransaction[] = []
  dataSource = new MatTableDataSource(this.dataInfo)
  subscription: any
  @ViewChild(MatSort) matSort! : MatSort
  filterBy: string = ''
  filterEvent: string = ''
  accountFilter = new FormControl()
  partyFilter = new FormControl()
  budgetFilter = new FormControl()
  globalFilter: string = ''
  filteredValues = { accountName: '', partyName: '', budgetName: '' }
  private transSubscription: Subscription

  constructor(ui:UiService){
    this.ui = ui
    ui.getTransactions()
    this.transSubscription = ui.whenTransUpdates().subscribe(trans => {
      this.dataSource.data = trans
      this.dataSource.sort = this.matSort
    })
  }
  ngOnInit() {
    // this.subscription = this.ui.getEmittedTransactions().subscribe(item => {
    //   this.dataSource.data = item
    //   this.dataSource.sort = this.matSort
    // })
    this.accountFilter.valueChanges.subscribe((accountFilterValue) => {
      this.filteredValues['accountName'] = accountFilterValue
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.partyFilter.valueChanges.subscribe((partyFilterValue) => {
      this.filteredValues['partyName'] = partyFilterValue
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.budgetFilter.valueChanges.subscribe((budgetFilterValue) => {
      this.filteredValues['budgetName'] = budgetFilterValue
      this.dataSource.filter = JSON.stringify(this.filteredValues)
    })
    this.dataSource.filterPredicate = this.customFilterPredicate()
  }
  ngOnDestroy(): void {
    this.transSubscription.unsubscribe()
  }
  searchFilterTable($event: any){
    this.dataSource.filter = $event.target.value
  }
  applyFilter(filter: any) {
    this.globalFilter = filter
    this.dataSource.filter = JSON.stringify(this.filteredValues)
  }
  customFilterPredicate() {
    const myFilterPredicate = (data: strTransaction, filter: string): boolean => {
      var globalMatch = !this.globalFilter

      if (this.globalFilter) {
        // search all text fields
        globalMatch = data.accountName.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1
      }

      if (!globalMatch) {
        return true // this was throwing error just returning, so i set it to false
      }

      let searchString = JSON.parse(filter)
      return data.accountName.toString().trim().indexOf(searchString.accountName) !== -1 &&
        data.partyName.toString().trim().toLowerCase().indexOf(searchString.partyName.toLowerCase()) !== -1 &&
        data.budgetName?.toString().trim().toLowerCase().indexOf(searchString.budgetName.toLowerCase()) !== -1
    }
    return myFilterPredicate
  }
  downloadTable() {
    var csvData = this.exportCSV(this.dataSource.filteredData)
    var a = document.createElement("a")
    a.setAttribute('style', 'display:none;')
    document.body.appendChild(a)
    var blob = new Blob([csvData], { type: 'text/csv' })
    var url = window.URL.createObjectURL(blob)
    a.href = url;
    a.download = 'Table.csv'
    a.click()
  }
  exportCSV(objArray: any): string {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
      var str = ''
      var row = ""

      for (var index in objArray[0]) {
          //Now convert each value to string and comma-separated
          row += index + ','
      }
      row = row.slice(0, -1)
      //append Label row with line break
      str += row + '\r\n';

      for (var i = 0; i < array.length; i++) {
          var line = ''
          for (var index in array[i]) {
              if (line != '') line += ','

              line += array[i][index]
          }
          str += line + '\r\n'
      }
      return str
  }
}