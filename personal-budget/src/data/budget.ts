export class Budget {
    id: number
    name: string
    total: number
    balance: number
    // accountId: number

    constructor(id: number, name: string, total: number, balance: number){ //, account: number
        this.id = id
        this.name = name
        this.total = total
        this.balance = balance
        // this.accountId = account
    }
}