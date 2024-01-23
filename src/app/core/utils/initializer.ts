import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseUser } from '../interfaces/user';
import { map, take } from 'rxjs';

export function initializeApplication() {
  const auth = inject(AuthService);
  return () =>
    auth.afAuth.authState.pipe(
      take(1),
      map((user: FirebaseUser | null) => {
        if (user) {
          auth.setUserData(user);
        } else {
          auth.clearUser();
        }
      })
    );
}
