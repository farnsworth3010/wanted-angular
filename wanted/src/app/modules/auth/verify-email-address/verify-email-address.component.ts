import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-verify-email-address',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email-address.component.html',
  styleUrl: './verify-email-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailAddressComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  sendVerificationMail() {
    this.authService.sendVerificationMail().subscribe(() => {
      this.router.navigate(['/auth/verify-email-address']);
      this.snackBar.dismiss();
    });
  }
}
