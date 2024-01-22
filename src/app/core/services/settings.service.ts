import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  animationsState = new BehaviorSubject<boolean>(true);
  $animationsState = this.animationsState.asObservable();

  themeState = new BehaviorSubject<boolean>(true);
  $themeState = this.themeState.asObservable();

  officeState = new BehaviorSubject<string>('any');
  $officeState = this.officeState.asObservable();

  constructor() {
    this.animationsState.next(JSON.parse(localStorage.getItem('animations')!) ?? true);
    this.officeState.next(localStorage.getItem('field_office')! ?? 'any');
    this.themeState.next(JSON.parse(localStorage.getItem('theme')!));
  }
}
