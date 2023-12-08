import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, config } from 'rxjs';
interface IAuth {
  firstname: string;
  username: string;
  lastname: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private stateItem: BehaviorSubject<any> = new BehaviorSubject(null);
  stateItem$: Observable<any> = this.stateItem.asObservable();
  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    const _localuser: any = JSON.parse(localStorage.getItem('userInfo')!);
    if (CheckAuth(_localuser)) {
      this.SetState(_localuser);
    }
  }
  SetState(item: IAuth) {
    this.stateItem.next(item);
    this.snackBar.dismiss();
    localStorage.setItem('userInfo', JSON.stringify(item));
  }
  RemoveState() {
    this.stateItem.next(null);
    localStorage.removeItem('userInfo');
    this.router.navigateByUrl('/');
  }
  Logout() {
    this.RemoveState();
  }
  signIn(userName: string | null, password: string | null) {
    this.http.get('assets/json/data.json').subscribe((res: any) => {
      if (userName && password) {
        if (res.users[userName] && res.users[userName].password === password) {
          let userInfo = {
            username: userName,
            firstname: res.users[userName].firstname,
            lastname: res.users[userName].lastname,
            password: password,
          };
          this.SetState(userInfo);
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Incorrect login or password!', '', {
            duration: 1000,
          });
        }
      } else {
        this.snackBar.open('You must enter credentials!', '', {
          duration: 1000,
        });
      }
    });
  }
  signInAsGuest() {
    let userInfo = {
      username: 'guest',
      firstname: 'guest',
      lastname: '',
      password: '',
    };
    this.SetState(userInfo);
    this.router.navigate(['/home']);
  }
}

const CheckAuth = (auth: IAuth): boolean => {
  return auth ? true : false;
};
