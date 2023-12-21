import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { WantedService } from "../../../../core/services/wanted/wanted.service";
import { ImageFallbackDirective } from "../../../../shared/directives/image-fallback.directive";
import { DefaultFieldValuePipe } from "../../../../shared/pipes/default-field-value.pipe";
import { DetailsComponent } from "../details/details.component";

@Component({
  selector: "app-global",
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ImageFallbackDirective,
    MatPaginatorModule,
    DefaultFieldValuePipe,
    DetailsComponent,
  ],
  templateUrl: "./global.component.html",
  styleUrl: "./global.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalComponent implements OnInit{
  data: any;
  page: number = 0;
  pages: number = 0;
  selectedPerson: any = {};
  length = 0;
  pageSize = 20;
  edited: any;
  handlePageEvent({ pageIndex }: PageEvent) {
    this.data = null;
    this.selectedPerson = null
    this.wantedService.page = pageIndex + 1;
    this.router.navigate(["/content/crimes/wanted/", pageIndex + 1]);
  }

  constructor(public wantedService: WantedService, private changeDetector: ChangeDetectorRef, private router: Router) {}

  selectPerson(id: number): void {
    this.selectedPerson = this.data[id];
  }

  ngOnInit(): void {
    this.wantedService.stateItem$.subscribe(() => {
      this.data = this.wantedService.data;
      this.page = this.wantedService.page;
      this.pages = this.wantedService.pages;
      this.selectedPerson = this.wantedService.selectedPerson;
      this.length = this.wantedService.length;
      this.changeDetector.markForCheck();
    });
  }
}
