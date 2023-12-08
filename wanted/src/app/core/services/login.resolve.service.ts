import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginResolveService implements Resolve<boolean>{

  constructor(private authService: AuthService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.stateItem$.pipe(
      map(user => {
        if (user) {
          this.router.navigateByUrl('/home')
        }
        return true
      })
    )
  }
  
}
