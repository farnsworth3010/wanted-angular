import { AuthService } from './auth/auth.service';
import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuardService {
//   constructor(public authService: AuthService, public router: Router)  {}
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
//     if (this.authService.isLoggedIn) return true;
//     else {
//       this.router.navigate(['auth/sign-in']);
//       return false;
//     }
//   }
// }

export const authCanActivate: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot)=> {
  const authService = inject(AuthService)
  const router: Router = inject(Router)
  if (authService.isLoggedIn) return true;
  else {
    router.navigate(['auth/sign-in']);
    return false;
  }
}
