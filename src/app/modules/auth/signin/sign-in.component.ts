import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseCredential } from '../../../core/interfaces/user';

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
    FormsModule,
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
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  hidePassword = true;

  onSubmit() {
    // fix btn
    if (this.signInForm.valid) {
      this.snackBar.open('Processing...', 'dismiss', { duration: 3000 });
      const { email, password } = this.signInForm.getRawValue();
      this.authService.signIn(email!, password!).subscribe({
        next: (result: FirebaseCredential) => {
          this.authService.setUserData(result.user!);
          this.snackBar.dismiss();
          this.router.navigateByUrl('/content/home');
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
        },
      });
    }
  }
  google() {
    this.snackBar.open('Processing...', 'dismiss', { duration: 3000 });
    this.authService.googleAuth().subscribe({
      next: (result: FirebaseCredential) => {
        this.authService.setUserData(result.user!);
        this.snackBar.dismiss();
        this.router.navigateByUrl('/content/home');
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
      },
    });
  }
  signInAsGuest() {
    this.authService.signInAsGuest();
  }
}
