import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-verify-email-address',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './verify-email-address.component.html',
  styleUrl: './verify-email-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyEmailAddressComponent {
  constructor(public authService: AuthService){}
}
