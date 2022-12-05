import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Budget } from 'src/data/budget';
import { Transaction } from 'src/data/transaction';
import { Party } from 'src/data/party';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  target: string | null
  accounts: Account[] = []
  budgets: Budget[] = []
  suggestedBudgets: Budget[] = this.budgets
  transactions: Transaction[] = []
  private parties: Party[] = []
  private http: HttpClient
  private accountsSubject: Subject<Account[]> = new Subject()
  private budgetsSubject: Subject<Budget[]> = new Subject()
  private transactionsSubject: Subject<Transaction[]> = new Subject()
  private partiesSubject: Subject<Party[]> = new Subject()
  newAccount: Account = new Account(0, '', '', 0)
  newBudget: Budget = new Budget(0, '', 0, 0)
  newTransaction: Transaction = {} as Transaction
  newTransactionPartyName: string = ''
  newTransactionBudgetName: string = ''
  private newParty: Party = {} as Party
  private newPartyId: number = 0
  private enteredParty: Party = {} as Party
  private budgetArr: number[] = []

  constructor(http: HttpClient, private _snackBar: MatSnackBar) {
    this.target = localStorage.getItem("page")? localStorage.getItem("page") : 'dashboard';
    this.http = http
    this.getAccounts()
    this.getBudgets()
    this.getTransactions()
    this.getParties()
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
      () => console.log('something went wrong in getTransactions()'))
  }
  private getParties(){
    this.http
      .get<Party[]>('http://localhost:3000/parties')
      .pipe(take(1))
      .subscribe({
        next: parties => {
        this.parties = parties
        this.partiesSubject.next(this.parties)
      },
      error: () => console.log('something went wrong in getParties()')
    })
  }
  private addParty(): number{
    this.newPartyId = this.parties.length > 0 ? this.parties[this.parties.length-1].id : 0
    this.newParty = { id: this.newPartyId + 1, name: this.newTransactionPartyName, budgetId: [this.newTransaction.budgetId ? this.newTransaction.budgetId : 0] }
    this.http
      .post('http://localhost:3000/parties', this.newParty)
      .pipe(take(1))
      .subscribe({
        next: () => this.getParties(), 
        error: () => this.openSnackBar('Something went wrong', 'Close'),
      })
    return this.newParty.id
  }
  private checkForPartyId(): number {
    this.getParties()
    for(let i = 0; i < this.parties.length; i++){
      if(this.newTransactionPartyName === this.parties[i].name){
        this.newTransaction.partyId = this.parties[i].id
        return this.newTransaction.partyId
      }
    }
    this.addParty()
    this.newTransaction.partyId = this.newParty.id
    return this.newTransaction.partyId
  }
  private getPartyId(): number {
    this.getParties()
    for(let i = 0; i < this.parties.length; i++){
      if(this.newTransactionPartyName === this.parties[i].name){
        this.newTransaction.partyId = this.parties[i].id
        return this.newTransaction.partyId
      }
    }
    return this.newTransaction.partyId = 0
  }
  addTransaction() {
    this.checkForPartyId()
    this.http
      .post('http://localhost:3000/transactions', this.newTransaction)
      .pipe(take(1))
      .subscribe(() => this.getTransactions(), () => this.openSnackBar('Something went wrong', 'Close'))
    this.newTransaction.id = this.newTransaction.id + 1
    this.newTransaction.partyId = 0
    this.newTransaction.amount = 0
    this.newTransaction.accountId = 0
  }
  suggestBudgets() {
    this.suggestedBudgets = []
    //get party that is typed in
    this.getPartyId() //returns this.newTransaction.partyId
    for(let i = 0; i < this.parties.length; i++){
      if(this.newTransaction.partyId === this.parties[i].id){
        this.enteredParty = this.parties[i]
        //get budget id or ids from that party
        //add those budgets to this.suggestedBudgets
        this.enteredParty.budgetId ? this.budgetArr = this.enteredParty.budgetId : this.budgetArr = []
        
        for(let i = 0; i < this.budgetArr.length; i++){
          //for every budgetId in this party, add that budget to suggestedBudgets
          for(let j = 0; j < this.budgets.length; j++){
            if(this.budgets[j].id === this.budgetArr[i])
              this.suggestedBudgets.push(this.budgets[j])
          }
        }
      }
    }
  }
}
