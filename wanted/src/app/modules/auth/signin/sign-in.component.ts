import { AuthService } from '../../../core/services/auth/auth.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {
  email = new FormControl('');
  password = new FormControl('');
  hide = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  onSubmit() {
    this.snackBar.open('Processing...', '');
    this.authService
      .signIn(this.email.value!, this.password.value!)
      .subscribe((result) => {
        if (result.message) {
          this.snackBar.open(result.message, '', { duration: 3000 });
        } else {
          this.authService.setUserData(result.user);
          this.router.navigate(['/content/home']);
          this.snackBar.dismiss();
        }
      });
  }
  google() {
    this.snackBar.open('Processing...', '');
    this.authService.googleAuth().subscribe((result) => {
      this.authService.setUserData(result.user);
      this.router.navigate(['/content/home']);
      this.snackBar.dismiss();
    });
  }
  signInAsGuest() {
    this.authService.signInAsGuest();
  }
}
