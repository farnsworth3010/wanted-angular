import { Injectable, OnInit } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument, } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, from, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { guest } from '../interfaces/guest';
import { IError } from '../interfaces/error';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user: firebase.default.User | null) => {
      if (user) this.setUserData(user);
      else this.clearUser();
    });
  }

  userData!: firebase.default.User | null | guest; // Save logged in user data

  private stateItem: BehaviorSubject<firebase.default.User | null | guest> = new BehaviorSubject(
    JSON.parse(localStorage.getItem('user')!)
  );
  stateItem$: Observable<firebase.default.User | null | guest> = this.stateItem.asObservable();

  signIn(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }
  signOut(): Observable<void> {
    return from(this.afAuth.signOut());
  }
  signUp(email: string, password: string): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }
  sendVerificationMail(): Observable<void> {
    return from(
      this.afAuth.currentUser.then((u: firebase.default.User | null) => u?.sendEmailVerification())
    );
  }
  forgotPassword(passwordResetEmail: string): Observable<void | IError> {
    return from(this.afAuth.sendPasswordResetEmail(passwordResetEmail)).pipe(
      catchError((error: IError) => of(error))
    );
  }
  signInAsGuest(): void {
    const guest = {
      email: 'guest',
      emailVerified: true,
    };
    this.stateItem.next(guest);
    this.snackBar.dismiss();
    localStorage.setItem('user', JSON.stringify(guest));
    this.router.navigate(['/content/home']);
  }
  setUserData(user: firebase.default.User) {
    this.userData = user;
    const { uid, email, displayName, photoURL, emailVerified } = user;
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
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
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified;
  }

  googleAuth(): Observable<firebase.default.auth.UserCredential> {
    return from(this.authLogin(new auth.GoogleAuthProvider()))
  }

  authLogin(provider: auth.AuthProvider): Observable<firebase.default.auth.UserCredential> {
    return from(this.afAuth.signInWithPopup(provider))

  }

  clearUser(): void {
    localStorage.removeItem('user');
    this.stateItem.next(null);
    this.snackBar.dismiss();
    this.router.navigateByUrl('/auth/sign-in');
  }

}