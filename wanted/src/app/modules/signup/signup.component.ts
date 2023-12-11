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
export class SignupComponent implements OnChanges {
  password = new FormControl('');
  password1 = new FormControl('');
  email = new FormControl('');
  hide = true;
  constructor(
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}
  onSubmit() {
      this.authService.SignUp(this.email.value!, this.password.value!, this.password1.value!);
  }
  signInAsGuest() {
    // this.authService.signInAsGuest();
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
