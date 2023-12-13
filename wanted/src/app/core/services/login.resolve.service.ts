import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginResolveService implements Resolve<boolean> {
  constructor(private authService: AuthService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.stateItem$.pipe(
      map(() => {
        const logged = this.authService.isLoggedIn;
        if (logged) {
          this.router.navigateByUrl('/content/home');
        }
        return true;
      })
    );
  }
}
