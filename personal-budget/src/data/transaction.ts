import { Account } from "./account"
import { Budget } from "./budget"
import { Party } from "./party"

export interface Transaction {
    id: number
    party: Party
    amount: number
    account: Account
    budget?: Budget
}