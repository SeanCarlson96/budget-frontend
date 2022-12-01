import { Account } from "./account"

export class Budget {
    name: string
    total: number
    balance: number
    account: Account

    constructor(name: string, total: number, balance: number, account: Account){
        this.name = name
        this.total = total
        this.balance = balance
        this.account = account
    }
}