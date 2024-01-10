import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { IError } from '../../../core/services/interfaces/error';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
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
  ) { }
  passResetForm = this.fb.group({
  email: new FormControl('', Validators.required),
  })

  resetPassword() {
    this.authService.forgotPassword(this.passResetForm.controls.email.value!).subscribe({
      next: () => {
        this.snackBar.open('Password reset email sent, check your inbox.', '', {
          duration: 3000,
        });
        this.router.navigateByUrl('/auth/sign-in');
      },
      error: (error: IError) => {
        this.snackBar.open(error.message, '', { duration: 3000 })
      }
    })
  }
}
