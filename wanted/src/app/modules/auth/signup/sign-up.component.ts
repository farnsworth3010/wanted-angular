import { AuthService } from '../../../core/services/auth/auth.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  matchValidator = (controlName: string, matchingControlName: string) => {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName)
      const matchingControl = abstractControl.get(matchingControlName)
      if (matchingControl!.errors && !matchingControl!.errors?.['confirmedValidator']) {
        return null;
      }
      if (control!.value !== matchingControl!.value) {
        const error = {confirmedValidator: 'Passwords do not match'}
        matchingControl!.setErrors(error)
        return error;
      } else {
        return null;
      }
    }
  }
  hide = true;
  passwordValidators = [Validators.required, Validators.minLength(8)]
  signUpForm = this.fb.group({
    password: ['', this.passwordValidators],
    passwordConfirm: ['', this.passwordValidators],
    email: ['', [Validators.required, Validators.email]],
  }, {
    validators: this.matchValidator('password', 'passwordConfirm')
  })

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  onSubmit() {
    if (!this.signUpForm.invalid) {
      this.authService
        .signUp(this.signUpForm.value.email!, this.signUpForm.value.password!)
        .subscribe({
          next: (result) => {
            this.authService.sendVerificationMail();
            this.authService.setUserData(result.user);
          }, error: (error) => {
            this.snackBar.open(error.message, '', {duration: 3000});
          }
        });
    }
  }

  google() {
    this.snackBar.open('Processing...', '');
    this.authService.googleAuth().subscribe((result) => {
      this.authService.setUserData(result.user);
      this.router.navigate(['/content/home']);
      this.snackBar.dismiss();
    });
  }
}
