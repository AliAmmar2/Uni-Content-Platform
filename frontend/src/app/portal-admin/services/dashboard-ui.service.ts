import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardUiService {
  private activeMenuSubject = new BehaviorSubject<string>('gyms');

  public activeMenu$ = this.activeMenuSubject.asObservable();

  public setActiveMenu(menu: string): void {
    this.activeMenuSubject.next(menu);
  }

  public clearMenu(): void {
    this.activeMenuSubject.next('');
  }
}
