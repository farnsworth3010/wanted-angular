import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, switchMap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseCredential, FirebaseUser, User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  private stateItem = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
  public stateItem$: Observable<User | null> = this.stateItem.asObservable();

  signIn(email: string, password: string): Observable<FirebaseCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  signOut(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  signUp(email: string, password: string): Observable<FirebaseCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  sendVerificationMail(): Observable<void | never> {
    return from(this.afAuth.currentUser).pipe(
      switchMap((user: FirebaseUser | null) => {
        if (user) {
          return user.sendEmailVerification();
        }
        return throwError(() => new Error('Error while sending verification mail...'));
      })
    );
  }

  forgotPassword(passwordResetEmail: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(passwordResetEmail));
  }

  signInAsGuest(): void {
    const guest = {
      email: 'Guest',
      emailVerified: true,
    };
    this.stateItem.next(guest);
    this.snackBar.dismiss();
    localStorage.setItem('user', JSON.stringify(guest));
    this.router.navigateByUrl('/content/home');
  }

  setUserData(user: FirebaseUser) {
    const { uid, email, displayName, photoURL, emailVerified } = user;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);

    localStorage.setItem('user', JSON.stringify(user));
    this.stateItem.next(user);

    return userRef.set(
      {
        uid,
        email,
        displayName,
        photoURL,
        emailVerified,
      },
      {
        merge: true,
      }
    );
  }

  get isLoggedIn(): boolean {
    const user: User | null = JSON.parse(localStorage.getItem('user')!);
    return user?.emailVerified ?? false;
  }

  googleAuth(): Observable<FirebaseCredential> {
    return from(this.authLogin(new auth.GoogleAuthProvider()));
  }

  authLogin(provider: auth.AuthProvider): Observable<FirebaseCredential> {
    return from(this.afAuth.signInWithPopup(provider));
  }

  clearUser(): void {
    localStorage.removeItem('user');
    this.stateItem.next(null);
    this.snackBar.dismiss();
    this.router.navigateByUrl('/auth/sign-in');
  }
}
