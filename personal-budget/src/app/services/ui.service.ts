import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  dashboard: boolean = true

  constructor() {
    let pageCheck = localStorage.getItem("dashboard")? localStorage.getItem("dashboard") : 'true'
    this.dashboard = JSON.parse(pageCheck)
   }

  page(): boolean{
    this.dashboard? false : true
    localStorage.setItem('dashboard', JSON.stringify(this.dashboard));
    return this.dashboard
  }
}
