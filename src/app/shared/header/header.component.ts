import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/user';
import { ImageFallbackDirective } from '../directives/image-fallback.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule, ImageFallbackDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor(
    public router: Router,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() sideNav!: MatSidenav;
  @Input() hideUserData: boolean = false;

  userData: User | null = null;
  isMobileWidth(): boolean {
    if (window.innerWidth < 769) {
      return true;
    }
    return false;
  }
  ngOnInit(): void {
    if (this.isMobileWidth()) {
      this.sideNav.mode = 'over';
      this.sideNav.close();
    } else {
      this.sideNav.mode = 'side';
      this.sideNav.open();
    }

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isMobileWidth()) {
          this.sideNav.mode = 'over';
          this.sideNav.close();
        } else {
          this.sideNav.mode = 'side';
          this.sideNav.open();
        }
      });

    this.authService.stateItem$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: User | null) => {
      if (res) {
        this.userData = res;
      }
      this.changeDetectorRef.markForCheck();
    });
  }
  closeMenu(): void {
    if (this.isMobileWidth()) {
      this.sideNav.mode = 'over';
      this.sideNav.close();
    }
  }

  logOut(): void {
    this.authService
      .signOut()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.authService.clearUser();
      });
  }
  toggleMenu(): void {
    this.sideNav.toggle();
  }
}
