import { AuthService } from '../../../core/services/auth/auth.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseCredential } from '../../../core/services/interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}
  signInForm = this.fb.group({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  hidePassword = true;

  onSubmit() {
    this.snackBar.open('Processing...', '');
    if (this.signInForm.valid) {
      const { email, password } = this.signInForm.value;
      this.authService.signIn(email!, password!).subscribe({
        next: (result: FirebaseCredential) => {
          this.authService.setUserData(result.user!);
          this.snackBar.dismiss();
          this.router.navigateByUrl('/content/home');
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, '', { duration: 3000 });
        },
      });
    }
  }
  google() {
    this.snackBar.open('Processing...', '');
    this.authService.googleAuth().subscribe({
      next: (result: FirebaseCredential) => {
        this.authService.setUserData(result.user!);
        this.snackBar.dismiss();
        this.router.navigateByUrl('/content/home');
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      },
    });
  }
  signInAsGuest() {
    this.authService.signInAsGuest();
  }
}
