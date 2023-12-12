import { AuthService } from '../../core/services/auth/auth.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import {
  FormControl,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnChanges {
  email = new FormControl('');
  password = new FormControl('');
  hide = true;
  constructor(
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  onSubmit() {
    this.authService
      .signIn(this.email.value!, this.password.value!)
      .subscribe((result) => {
        if (result.message) {
          this.snackBar.open(result.message, '', { duration: 3000 });
        } else {
          this.authService.setUserData(result.user);
          this.router.navigate(['home']);
          this.snackBar.dismiss();
        }
      });
  }
  google() {
    this.authService.googleAuth().subscribe(()=> {
      this.router.navigate(['home']);
      this.snackBar.dismiss();
    })
  }
  signInAsGuest() {
    this.authService.signInAsGuest();
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
