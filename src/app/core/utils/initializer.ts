import { inject } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirebaseUser } from '../interfaces/user';

export function initializeApplication() {
  const auth = inject(AuthService);
  auth.afAuth.authState.subscribe((user: FirebaseUser | null) => {
    if (user) {
      auth.setUserData(user);
    } else {
      auth.clearUser();
    }
  });
  return () => of(true); // ???
}
