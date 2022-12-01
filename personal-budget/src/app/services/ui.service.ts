import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { Account } from 'src/data/account';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  target: string | null
  accounts: Account[] = []
  private http: HttpClient
  private accountsSubject: Subject<Account[]> = new Subject()
  newAccount = new Account(0, '', '', 0)

  constructor(http: HttpClient, private _snackBar: MatSnackBar) {
    this.target = localStorage.getItem("page")? localStorage.getItem("page") : 'dashboard';
    this.http = http
    this.getAccounts()
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
}
