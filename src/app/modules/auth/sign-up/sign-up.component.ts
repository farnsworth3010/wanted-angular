import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseCredential } from '../../../core/interfaces/user';
import { passValidator } from '../../../core/utils/validators/pass.validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {}

  hidePassword = true;

  signUpForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    },
    {
      validators: [passValidator()],
    }
  );

  onSubmit() {
    if (this.signUpForm.valid) {
      this.snackBar.open('Processing...', 'dismiss', { duration: 3000 });
      const { email, password } = this.signUpForm.value;
      this.authService.signUp(email!, password!).subscribe({
        next: (result: FirebaseCredential) => {
          this.authService.sendVerificationMail();
          this.authService.setUserData(result.user!);
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
}
