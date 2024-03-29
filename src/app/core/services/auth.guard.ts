import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const authCanActivate: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  router.navigateByUrl('/auth/sign-in');
  return false;
};