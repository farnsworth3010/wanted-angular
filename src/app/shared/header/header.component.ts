import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/interfaces/user';
import { ImageFallbackDirective } from '../directives/image-fallback.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenav } from '@angular/material/sidenav';
import { fromEvent } from 'rxjs';
import { isMobileWidth } from '../../core/utils/is-mobile';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule, ImageFallbackDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  constructor(
    public router: Router,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  @Input() sideNav!: MatSidenav;
  @Input() hideUserData: boolean = false;

  @ViewChild('menuToggle') menuToggle!: MatIconButton;

  sideNavMobileCheck(): void {
    if (isMobileWidth()) {
      this.sideNav.mode = 'over';
      this.sideNav.close();
    } else {
      this.sideNav.mode = 'side';
      this.sideNav.open();
    }
  }

  userData: User | null = null;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.sideNavMobileCheck();
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.sideNavMobileCheck();
      });

    this.authService.stateItem$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: User | null) => {
      if (res) {
        this.userData = res;
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  closeMenu(): void {
    if (isMobileWidth()) {
      this.sideNav.mode = 'over';
      this.sideNav.close();
    }
    this.menuToggle._elementRef.nativeElement.blur();
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
