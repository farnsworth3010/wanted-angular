import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/services/interfaces/user';
import { ImageFallbackDirective } from '../directives/image-fallback.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    ImageFallbackDirective
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor(public router: Router, private authService: AuthService) {}
  @Input() hideUserData: boolean = false;
  userData!: User | null;
  ngOnInit(): void {
    this.authService.stateItem$.subscribe((res: User | null) => {
      if (res) this.userData = res;
    });
  }
  logOut(): void {
    this.authService.signOut().subscribe(() => {
      this.authService.clearUser();
    });
  }
}
