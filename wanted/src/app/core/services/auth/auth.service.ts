import { Injectable, NgZone, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, from, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data
  private stateItem: BehaviorSubject<any> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user')!)
  );
  stateItem$: Observable<any> = this.stateItem.asObservable();
  guest = {
    email: 'guest',
    emailVerified: true,
  };
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
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

  signIn(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      catchError((error) => of(error))
    );
  }
  signInAsGuest() {
    localStorage.setItem('user', JSON.stringify(this.guest));
    this.userData = this.guest;
    this.stateItem.next(this.guest);
    this.router.navigate(['/content/home']);
    this.snackBar.dismiss();
  }
  signUp(email: string, password: string, password1: string) {
    if (password !== password1) {
      return of({ message: 'Passwords have to be the same' });
    } else {
      return from(
        this.afAuth.createUserWithEmailAndPassword(email, password)
      ).pipe(catchError((error) => of(error)));
    }
  }
  setUserData(user: any) {
    this.userData = user;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.stateItem.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    return userRef.set(userData, {
      merge: true,
    });
  }
  sendVerificationMail() {
    return from(
      this.afAuth.currentUser.then((u: any) => u.sendEmailVerification())
    );
  }
  forgotPassword(passwordResetEmail: string) {
    return from(this.afAuth.sendPasswordResetEmail(passwordResetEmail)).pipe(
      catchError((error) => of(error))
    );
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }
  googleAuth() {
    return from(this.authLogin(new auth.GoogleAuthProvider()));
  }
  authLogin(provider: any) {
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      catchError((error) => of(error))
    );
    // .then((result) => {
    //   this.router.navigate(['home']);
    //   this.snackBar.dismiss();
    //   this.setUserData(result.user);
    // })
  }
  clearUser() {
    localStorage.removeItem('user');
    this.stateItem.next(null);
    this.router.navigate(['auth/sign-in']);
    this.snackBar.dismiss();
  }
  signOut() {
    return from(this.afAuth.signOut());
  }
}
