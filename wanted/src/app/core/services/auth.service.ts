import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jsonDataResult: any;
  constructor(private router: Router, private http: HttpClient) {}
  signIn(userName: string | null, password: string | null) {
    this.http.get('assets/json/data.json').subscribe((res) => {
      this.jsonDataResult = res;
      console.log(userName);
      if (userName && password) {
        if (
          this.jsonDataResult.users[userName] &&
          this.jsonDataResult.users[userName].password === password
        ) {
          localStorage.setItem('userName', userName);
          localStorage.setItem('firstname', this.jsonDataResult.users[userName].firstname);
          this.router.navigate(['/home']);
        }
      }
    });
  }
  signInAsGuest() {
    localStorage.setItem('firstname', 'guest');
    this.router.navigate(['/home']);
  }
}
