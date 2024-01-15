import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  animations: boolean = true;
  constructor() {
    this.animations = JSON.parse(localStorage.getItem('animations')!) ?? true;
  }
}
