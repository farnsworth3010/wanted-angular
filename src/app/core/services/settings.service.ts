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

  saveAnimationState(value: boolean): void {
    localStorage.setItem('animations', String(value));
    this.animationsState.next(value);
  }

  saveThemeState(value: boolean): void {
    localStorage.setItem('theme', String(value));
    this.themeState.next(value);
  }

  saveOfficeState(value: string): void {
    localStorage.setItem('officeState', value);
    this.officeState.next(value);
  }

  constructor() {
    this.animationsState.next(JSON.parse(localStorage.getItem('animations')!) ?? true);
    this.officeState.next(localStorage.getItem('officeState')! ?? 'any');
    this.themeState.next(JSON.parse(localStorage.getItem('theme')!));
  }
}
