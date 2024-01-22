import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseUser } from '../interfaces/user';
import { of } from 'rxjs';

export function initializeApplication() {
  const auth = inject(AuthService);
  auth.afAuth.authState.subscribe((user: FirebaseUser | null) => {
    if (user) {
      auth.setUserData(user);
    } else {
      auth.clearUser();
    }
  });
  return ()=>of(true)
}
