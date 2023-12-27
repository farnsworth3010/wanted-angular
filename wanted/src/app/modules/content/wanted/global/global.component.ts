import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { WantedService } from "../../../../core/services/wanted/wanted.service";
import { ImageFallbackDirective } from "../../../../shared/directives/image-fallback.directive";
import { DefaultFieldValuePipe } from "../../../../shared/pipes/default-field-value.pipe";
import { DetailsComponent } from "../details/details.component";
import { debounceTime, switchMap, tap } from "rxjs";
import { MatSelectModule } from "@angular/material/select";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
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
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
  ],
  templateUrl: "./global.component.html",
  styleUrl: "./global.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalComponent implements OnInit, OnDestroy {
  data: any;
  page: number = 1;
  pages: number = 0;
  selectedPerson: any = {};
  length = 0;
  pageSize = 20;
  edited: any;

  // Filters
  filtersForm = this.fb.group({
    sex: [""],
    race: [""],
    age_min: [""],
    age_max: [""],
  });

  private readonly debTime = 1000;
  routeSub: any;
  filtersSub: any;
  handlePageEvent({ pageIndex }: PageEvent) {
    this.data = null;
    this.selectedPerson = null;
    this.wantedService.page = pageIndex + 1;
    this.router.navigate(["/content/crimes/wanted/", this.wantedService.page]);
  }
  constructor(
    public wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  selectPerson(id: number): void {
    this.selectedPerson = this.data[id];
  }
  resetFilters() {
    this.filtersForm.reset()
    this.wantedService.filters = {}
    this.filtersSub.unsubscribe()
  }

  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges.pipe(debounceTime(1000)).subscribe((res) => {
      this.wantedService.updateFilters(res);
      this.wantedService.getData().subscribe((res: any) => {
        this.wantedService.selectedPerson = res.items[0];
        this.wantedService.data = res.items;
        this.wantedService.pages = res.page;
        this.wantedService.length = res.total;
        this.wantedService.fetching = false;
        this.wantedService.stateItem.next(res.items);
      });
    });
    this.routeSub = this.activatedRoute.paramMap
      .pipe(
        tap((map) => {
          this.wantedService.fetching = true;
          this.changeDetector.detectChanges();
          if (Number(map.get("id"))) {
            this.wantedService.page = Number(map.get("id"));
            this.wantedService.pageItem.next(this.wantedService.page);
          }
        }),
        debounceTime(this.debTime),
        switchMap((map) => {
          return this.wantedService.getData();
        })
      )
      .subscribe((res: any) => {
        this.wantedService.selectedPerson = res.items[0];
        this.wantedService.data = res.items;
        this.wantedService.pages = res.page;
        this.wantedService.length = res.total;
        this.wantedService.fetching = false;
        this.wantedService.stateItem.next(res.items);
      });

    this.wantedService.stateItem$.subscribe(() => {
      this.data = this.wantedService.data;
      this.page = this.wantedService.page;
      this.pages = this.wantedService.pages;
      this.selectedPerson = this.wantedService.selectedPerson;
      this.length = this.wantedService.length;
      this.changeDetector.markForCheck();
    });
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.resetFilters();
  }
}
