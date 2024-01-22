import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WantedService } from '../../../core/services/wanted.service';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { navLink } from '../../../core/interfaces/navLink';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-wanted',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './wanted.component.html',
  styleUrl: './wanted.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WantedComponent implements OnInit {
  constructor(
    private changeDetector: ChangeDetectorRef,
    private wantedService: WantedService,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}

  wantedSubscription!: Subscription;
  routerSubscription!: Subscription;

  navLinks = signal<navLink[]>([
    {
      label: 'Wanted',
      link: `/content/crimes/wanted/1`,
      disabled: false,
    },
    {
      label: 'Edited',
      link: '/content/crimes/edited',
      disabled: this.authService.stateItem.getValue()?.email === 'Guest',
    },
  ]);

  ngOnInit(): void {
    console.log(this.navLinks())
    this.wantedService.pageItem$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((page: number) => {
      this.navLinks.update((value: navLink[]) => {
        value[0].link = `/content/crimes/wanted/${page}`;
        return value;
      });
      this.changeDetector.detectChanges();
    });
  }
}
