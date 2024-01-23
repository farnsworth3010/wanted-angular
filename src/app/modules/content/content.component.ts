import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import {
  ChildrenOutletContexts,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GoTopComponent } from '../../shared/go-top/go-top.component';
import { contentRouteAnimation } from '../../core/animations';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, MatSidenavModule, RouterLink, MatIconModule, RouterLinkActive, GoTopComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [contentRouteAnimation],
})
export class ContentComponent implements OnInit {
  menuItems = [
    {
      link: '/content/home',
      icon: 'home',
      name: 'Home',
    },
    {
      link: '/content/crimes/',
      icon: 'star',
      name: 'Wanted',
    },
    {
      link: '/content/settings',
      icon: 'settings',
      name: 'Settings',
    },
  ];

  constructor(
    private contexts: ChildrenOutletContexts,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router
  ) {}

  @ViewChild('sideNavContent') sideNavContent!: MatSidenavContent;

  ngOnInit(): void {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.sideNavContent.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }

  getAnimationsData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  logOut() {
    this.authService
      .signOut()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.authService.clearUser();
      });
  }
}
