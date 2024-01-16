import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../core/interfaces/user';

@Component({
  selector: 'app-verify-email-address',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email-address.component.html',
  styleUrl: './verify-email-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailAddressComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}
  userData: User | null = null;
  ngOnInit(): void {
    this.authService.stateItem$.subscribe((user: User | null) => {
      if (user) {
        this.userData = user;
      }
      // markforcheck
    });
  }
  sendVerificationMail() {
    this.authService.sendVerificationMail().subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/verify-email-address');
        this.snackBar.dismiss();
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
      },
    });
  }
}
