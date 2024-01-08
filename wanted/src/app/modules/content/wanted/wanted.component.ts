import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { WantedService } from "../../../core/services/wanted/wanted.service";
import { ImageFallbackDirective } from "../../../shared/directives/image-fallback.directive";
import { DefaultFieldValuePipe } from "../../../shared/pipes/default-field-value.pipe";
import { Subscription } from "rxjs";

@Component({
  selector: "app-wanted",
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ImageFallbackDirective,
    RouterLink,
    RouterLinkActive,
    MatPaginatorModule,
    DefaultFieldValuePipe,
    RouterOutlet,
  ],
  templateUrl: "./wanted.component.html",
  styleUrl: "./wanted.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WantedComponent implements OnInit {
  constructor(private changeDetector: ChangeDetectorRef, private wantedService: WantedService) { }
  wantedSubscription!: Subscription;
  routerSubscription!: Subscription;
  navLinks = [
    {
      label: "Wanted",
      link: `/content/crimes/wanted/1`,
    },
    {
      label: "Edited",
      link: "/content/crimes/edited",
    },
  ];

  updateNavLink(): void {
    this.navLinks[0].link = `/content/crimes/wanted/${this.wantedService.page}`;
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.wantedService.pageItem$.subscribe(() => {
      this.updateNavLink()
    })
  }
}
