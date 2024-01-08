import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { IError } from '../../../core/services/interfaces/error';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
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
    private router: Router
  ) { }

  email = new FormControl('');

  resetPassword() {
    this.authService.forgotPassword(this.email.value!).subscribe((error: any) => {
      if (!error) {
        this.snackBar.open('Password reset email sent, check your inbox.', '', {
          duration: 3000,
        });
        this.router.navigate(['/auth/sign-in']);
      } else this.snackBar.open(error.message, '', { duration: 3000 });
    });
  }
}
