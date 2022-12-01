export class Account {
    id: number
    name: string
    type: string
    balance: number

    constructor(id: number = 0, name: string, type: string, balance: number){
        this.id = id
        this.name = name
        this.type = type
        this.balance = balance
    }
}