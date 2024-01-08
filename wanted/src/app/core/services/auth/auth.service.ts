import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.setUserData(user);
      } else {
        this.clearUser();
      }
    });
  }

  userData!: firebase.default.User; // Save logged in user data
  private stateItem: BehaviorSubject<any> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user')!)
  );
  stateItem$: Observable<any> = this.stateItem.asObservable();

  signIn(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  signInAsGuest(): void {
    const guest = {
      email: 'guest',
      emailVerified: true,
    };
    localStorage.setItem('user', JSON.stringify(guest));
    this.stateItem.next(guest);
    this.snackBar.dismiss();
    this.router.navigate(['/content/home']);
  }

  signUp(email: string, password: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  setUserData(user: firebase.default.User) {
    this.userData = user;
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

  sendVerificationMail(): Observable<void> {
    return from(
      this.afAuth.currentUser.then((u: firebase.default.User | null) => u?.sendEmailVerification())
    );
  }

  forgotPassword(passwordResetEmail: string): Observable<void> {
    return from(this.afAuth.sendPasswordResetEmail(passwordResetEmail)).pipe(
      catchError((error) => of(error))
    );
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified;
  }

  googleAuth(): Observable<auth.UserCredential> {
    return from(this.authLogin(new auth.GoogleAuthProvider()));
  }

  authLogin(provider: auth.AuthProvider): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      catchError((error) => of(error))
    );
  }

  clearUser(): void {
    localStorage.removeItem('user');
    this.stateItem.next(null);
    this.snackBar.dismiss();
    this.router.navigate(['auth/sign-in']);
  }

  signOut(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}