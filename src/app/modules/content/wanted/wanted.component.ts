import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WantedService } from '../../../core/services/wanted.service';
import { Subscription } from 'rxjs';

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
  constructor(private changeDetector: ChangeDetectorRef, private wantedService: WantedService) {}
  wantedSubscription!: Subscription;
  routerSubscription!: Subscription;
  navLinks = [
    {
      label: 'Wanted',
      link: `/content/crimes/wanted/1`,
    },
    {
      label: 'Edited',
      link: '/content/crimes/edited',
    },
  ];

  updateNavLink(): void {
    this.navLinks[0].link = `/content/crimes/wanted/${this.wantedService.page}`;
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    // отписка
    this.wantedService.pageItem$.subscribe(() => {
      this.updateNavLink();
    });
  }
}
