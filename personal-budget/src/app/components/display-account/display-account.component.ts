import { Component, Input } from '@angular/core';
import { Account } from 'src/data/account';

@Component({
  selector: 'app-display-account',
  templateUrl: './display-account.component.html',
  styleUrls: ['./display-account.component.css']
})
export class DisplayAccountComponent {
  @Input() account: Account = new Account(-1, '', '', -1)
}
