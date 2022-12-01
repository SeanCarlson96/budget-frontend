import { Budget } from "./budget"

export class Party {
    name: string
    budget: Budget[]

    constructor(name: string, budget: Budget[]){
        this.name = name
        this.budget = budget
    }
}