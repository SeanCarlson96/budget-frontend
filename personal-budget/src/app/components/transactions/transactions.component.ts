import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  ui: UiService
  constructor(ui:UiService){
    this.ui = ui
  }
}
