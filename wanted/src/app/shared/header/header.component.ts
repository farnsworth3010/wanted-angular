import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor(
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private authService: AuthService
  ) {}
  @Input() noData: boolean = false;
  @Input() opacity: number = 1;
  @HostBinding('style.opacity') get getOpacity() {
    return this.opacity;
  }
  userData: any = {};
  ngOnInit(): void {
    this.authService.stateItem$.subscribe((res) => {
      if (res) {
        this.userData = res;
      }
    });
  }
  logOut(): void {
    this.authService.signOut().subscribe(() => {
      this.authService.clearUser();
    });
  }
}
