export interface Transaction {
    id: number
    partyId: number
    amount: number
    accountId: number
    budgetId?: number
}