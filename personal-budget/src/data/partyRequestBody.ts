import { Party } from "./party";

export class PartyRequestBody {
    party: Party
    budgetId: number

constructor(party: Party, budgetId: number){
    this.party = party
    this.budgetId = budgetId
}
}