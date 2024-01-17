import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {}

  passResetForm = this.fb.group({
    email: ['', Validators.required],
  });

  resetPassword() {
    if (this.passResetForm.valid) {
      this.authService.forgotPassword(this.passResetForm.value.email!).subscribe({
        next: () => {
          this.snackBar.open('Password reset email sent, check your inbox.', 'dismiss', {
            duration: 3000,
          });
          this.router.navigateByUrl('/auth/sign-in');
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
        },
      });
    }
  }
}
