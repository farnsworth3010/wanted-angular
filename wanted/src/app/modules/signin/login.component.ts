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
import { RouterLink } from '@angular/router';

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
    RouterLink
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
    private changeDetector: ChangeDetectorRef
  ) {}
  onSubmit() {
    this.authService.SignIn(this.email.value!, this.password.value!);
  }
  signInAsGuest() {
    console.log('sdf')
    this.authService.SignInAsGuest();
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
