import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export const LoginResolveFn: ResolveFn<Observable<any>> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService)
  const router: Router = inject(Router)
  return authService.stateItem$.pipe(
    map(() => {
      const logged = authService.isLoggedIn;
      if (logged) {
        router.navigateByUrl('/content/home');
      }
      return true;
    })
  )
}