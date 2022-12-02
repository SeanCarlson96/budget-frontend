import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Budget } from 'src/data/budget';
import { Transaction } from 'src/data/transaction';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  target: string | null
  accounts: Account[] = []
  budgets: Budget[] = []
  transactions: Transaction[] = []
  private http: HttpClient
  private accountsSubject: Subject<Account[]> = new Subject()
  private budgetsSubject: Subject<Budget[]> = new Subject()
  private transactionsSubject: Subject<Transaction[]> = new Subject()
  newAccount = new Account(0, '', '', 0)
  newBudget = new Budget(0, '', 0, 0)
  newTransaction = {} as Transaction
  newTransactionPartyName: string = ''
  newTransactionBudgetName: string = ''


  constructor(http: HttpClient, private _snackBar: MatSnackBar) {
    this.target = localStorage.getItem("page")? localStorage.getItem("page") : 'dashboard';
    this.http = http
    this.getAccounts()
    this.getBudgets()
    this.getTransactions()
  }
  page(target: string): string{
    localStorage.setItem("page", target);
    return this.target = target
  }
  getAccounts(){
    this.http
      .get<Account[]>('http://localhost:3000/accounts')
      .pipe(take(1))
      .subscribe(accounts => {
        this.accounts = accounts
        this.accountsSubject.next(this.accounts)
      },
      () => console.log('something went wrong in getAccounts()'))
  }
  addAccount(){
    this.http
      .post('http://localhost:3000/accounts', this.newAccount)
      .pipe(take(1))
      .subscribe(() => this.getAccounts(), () => this.openSnackBar('Something went wrong', 'Close'))
    this.newAccount.id = this.newAccount.id + 1
    this.newAccount.name = ''
    this.newAccount.type = ''
    this.newAccount.balance = 0
  }
  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action);
  }
  getBudgets(){
    this.http
      .get<Budget[]>('http://localhost:3000/budgets')
      .pipe(take(1))
      .subscribe(budgets => {
        this.budgets = budgets
        this.budgetsSubject.next(this.budgets)
      },
      () => console.log('something went wrong in getAccounts()'))
  }
  addBudget(){
    this.http
      .post('http://localhost:3000/budgets', this.newBudget)
      .pipe(take(1))
      .subscribe(() => this.getBudgets(), () => this.openSnackBar('Something went wrong', 'Close'))
    this.newBudget.id = this.newBudget.id + 1
    this.newBudget.name = ''
    this.newBudget.total = 0
    this.newBudget.balance = 0
  }
  getTransactions(){
    this.http
      .get<Transaction[]>('http://localhost:3000/transactions')
      .pipe(take(1))
      .subscribe(transactions => {
        this.transactions = transactions
        this.transactionsSubject.next(this.transactions)
      },
      () => console.log('something went wrong in getAccounts()'))
  }
  addTransaction() {
    //check parties for the inputed party string
    //retunr the id for that party and set it to newTransaction.partyId

    //account and amount should be good to go

    //check budgets for budget name. send error if the budget name does not
    //exist. if found, set that budget id to newTransaction.budgetId

    //make sure the new transaction is built. it should be at this point
    //make a post to the transactions with the new info
  }
}
