import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../core/interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-verify-email-address',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email-address.component.html',
  styleUrl: './verify-email-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailAddressComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private destroyRef: DestroyRef
  ) {}

  userData: User | null = null;

  ngOnInit(): void {
    this.authService.stateItem$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user: User | null) => {
      if (user) {
        this.userData = user;
      }

      this.changeDetectorRef.markForCheck();
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
