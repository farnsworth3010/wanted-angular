import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet, RoutesRecognized } from "@angular/router";
import { debounceTime, filter, switchMap, tap } from "rxjs";
import { WantedService } from "../../../core/services/wanted/wanted.service";
import { ImageFallbackDirective } from "../../../shared/directives/image-fallback.directive";
import { DefaultFieldValuePipe } from "../../../shared/pipes/default-field-value.pipe";
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
  navLinks!: any[];
  activeLinkIndex: number = -1;
  private readonly debTime = 1000;
  updateNavLinks() {
    this.navLinks = [
      {
        label: "Wanted",
        link: `/content/crimes/wanted/${this.wantedService.page}`,
        index: 0,
      },
      {
        label: "Edited",
        link: "/content/crimes/edited",
        index: 1,
      },
    ];
  }
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private changeDetector: ChangeDetectorRef, private wantedService: WantedService) {
    this.updateNavLinks();
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e)=>e instanceof NavigationEnd)
    ).subscribe(()=>{
      console.log('ff')
    })
    this.router.events.pipe(
      filter((e)=> e instanceof NavigationEnd)
    ).subscribe(()=> {
      console.log(gg)
    })
    let gg = this.activatedRoute.firstChild?.paramMap
      .pipe(
        tap(() => this.updateNavLinks()),
        debounceTime(this.debTime),
        switchMap((map) => {
          this.wantedService.page = Number(map.get("id"));
          return this.wantedService.getData();
        })
      )
      .subscribe((res: any) => {
        this.wantedService.selectedPerson = res.items[0];
        this.wantedService.setData({ data: res.items, pages: res.page, total: res.total });
        this.changeDetector.detectChanges();
      });
  }
}
