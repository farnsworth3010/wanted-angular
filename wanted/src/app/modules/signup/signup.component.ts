import { AuthService } from '../../core/services/auth/auth.service';
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
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  password = new FormControl('');
  password1 = new FormControl('');
  email = new FormControl('');
  hide = true;
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  onSubmit() {
    this.authService
      .signUp(this.email.value!, this.password.value!, this.password1.value!)!
      .subscribe((result) => {
        if (result.message) {
          this.snackBar.open(result.message, '', { duration: 3000 });
        } else {
          this.authService.sendVerificationMail();
          this.authService.setUserData(result.user);
        }
      });
  }
  google() {
    this.authService.googleAuth().subscribe(()=> {
      this.router.navigate(['home']);
      this.snackBar.dismiss();
    })
  }
}
