import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Budget } from 'src/data/budget';
import { Transaction } from 'src/data/transaction';
import { Party } from 'src/data/party';
import { strTransaction } from 'src/data/strTransaction';

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
  income: boolean = false
  private updatedAccountBalance: number = 0
  private currentAccountBalance: number = 0
  private updatedBudgetBalance: number = 0
  private currentBudgetBalance: number = 0
  @Output() updatedTransactions: EventEmitter<strTransaction[]> = new EventEmitter();
  translatedTransactions: strTransaction[] = []

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
        this.updatedTransactions.emit(this.translateTransactions(this.transactions))
      },
      () => console.log('something went wrong in getTransactions()'))
  }
  getEmittedTransactions() {
    return this.updatedTransactions;
  }
  translateTransactions(transactions: Transaction[]): strTransaction[]{
    for(let i = 0; i < transactions.length; i++){
      let tran: strTransaction = {} as strTransaction
      this.http
        .get<Party>('http://localhost:3000/parties/' + transactions[i].partyId)
        .pipe(take(1))
        .subscribe(party => tran.partyName = party.name)
      this.http
        .get<Account>('http://localhost:3000/accounts/' + transactions[i].accountId)
        .pipe(take(1))
        .subscribe(account => tran.accountName = account.name)
      this.http
        .get<Budget>('http://localhost:3000/budgets/' + transactions[i].budgetId)
        .pipe(take(1))
        .subscribe(budget => tran.budgetName = budget.name)
      tran.id = transactions[i].id
      tran.amount = transactions[i].amount
      this.translatedTransactions.push(tran)
    }
    return this.translatedTransactions
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
    if(
      this.newTransactionPartyName === '' ||
      this.newTransaction.accountId === 0 ||
      this.newTransaction.amount === 0
    ){this.openSnackBar('Please enter all required feilds', 'Close')} else {
    this.checkForPartyId()
    if(this.income === false) { this.newTransaction.amount = this.newTransaction.amount * -1 }
    this.http
      .post('http://localhost:3000/transactions', this.newTransaction)
      .pipe(take(1))
      .subscribe(() => this.getTransactions(), () => this.openSnackBar('Something went wrong', 'Close'))
    //find account based on this.newTransaction.accountId
    for(let i = 0; i < this.accounts.length; i++){
      if(this.accounts[i].id === this.newTransaction.accountId){
        this.currentAccountBalance = this.accounts[i].balance
      }
    }
    //apply this.newTransaction.amount to the budget.balance
    this.updatedAccountBalance = this.currentAccountBalance + this.newTransaction.amount
    this.http
      .patch('http://localhost:3000/accounts/' + this.newTransaction.accountId, {balance: this.updatedAccountBalance})
      .pipe(take(1))
      .subscribe(() => this.getAccounts(), () => this.openSnackBar('Something went wrong', 'Close'))
    //find Budget based on this.newTransaction.budgetId
    for(let i = 0; i < this.budgets.length; i++){
      if(this.budgets[i].id === this.newTransaction.budgetId){
        this.currentBudgetBalance = this.budgets[i].balance
      }
    }
    //apply this.newTransaction.amount to the account.balance
    this.updatedBudgetBalance = this.currentBudgetBalance + this.newTransaction.amount
    this.http
      .patch('http://localhost:3000/budgets/' + this.newTransaction.budgetId, {balance: this.updatedBudgetBalance})
      .pipe(take(1))
      .subscribe(() => this.getBudgets(), () => this.openSnackBar('Something went wrong', 'Close'))
    //reset feilds
    this.newTransaction.id = this.newTransaction.id + 1
    this.newTransactionPartyName = ''
    this.newTransaction.partyId = 0
    this.newTransaction.amount = 0
    this.newTransaction.accountId = 0
  }
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
  checkForSuggestedBudgets(transaction: Transaction){
    //loop through parties
    for(let i = 0; i < this.parties.length; i++){
      //if the transaction partyId is in parties
      if(transaction.partyId === this.parties[i].id){
        //get that full party information
        this.enteredParty = this.parties[i]
        //create an array of the budgets listed for that party
        this.enteredParty.budgetId ? this.budgetArr = this.enteredParty.budgetId : this.budgetArr = []
        //loop through the budgetArr
        for(let i = 0; i < this.budgetArr.length; i++){
          //loop through budgets
          for(let j = 0; j < this.budgets.length; j++){
            //if the number in budgetArr is the id inside budgets
            if(this.budgets[j].id === this.budgetArr[i])
              //add that whole budget into suggestedBudgets
              this.suggestedBudgets.push(this.budgets[j])
          }
        }
      }
    }

  }
  budgetAssociator(){
    //loop through this.transactions
    for(let i = 0; i < this.transactions.length; i++){
      
      if(this.transactions[i].budgetId){
      } else {
        //if there is no budgetId listed, check/make the suggestedbudgets for that
        //transactions party
        this.checkForSuggestedBudgets(this.transactions[i])

        //if there are suggestedbudgets, add them into the transaction
        if(this.suggestedBudgets.length > 0){
          this.http
            .patch('http://localhost:3000/transactions/' + this.transactions[i].id, {budgetId: this.suggestedBudgets[0].id})
            .pipe(take(1))
            .subscribe(() => this.getTransactions(), () => this.openSnackBar('Something went wrong', 'Close'))
        } else {
        //else add the miscellaneous budget to the transaction
        this.http
            .patch('http://localhost:3000/transactions/' + this.transactions[i].id, {budgetId: -1})
            .pipe(take(1))
            .subscribe(() => this.getTransactions(), () => this.openSnackBar('Something went wrong', 'Close'))
        }
      }
    }
  }
  
}
