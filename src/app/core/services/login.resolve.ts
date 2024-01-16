import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export const LoginResolveFn: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.stateItem$.pipe(
    map(() => {
      const logged = authService.isLoggedIn;
      if (logged) {
        router.navigateByUrl('/content/home');
      }
      return true;
    })
  );
};

// добавить в public
// не использовать resolvefn
