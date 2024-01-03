import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnDestroy, OnInit } from "@angular/core";
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
import { Subscription, debounceTime, switchMap, tap } from "rxjs";
import { MatSelectModule } from "@angular/material/select";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSliderModule } from "@angular/material/slider";
import { MatDialog, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { EditCrimeComponent } from "../../../../shared/dialogs/edit-crime/edit-crime.component";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { CriminalComponent } from "../criminal/criminal.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
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
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    CriminalComponent,
  ],
  templateUrl: "./global.component.html",
  styleUrl: "./global.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalComponent implements OnInit, OnDestroy {
  pageSize = 20;
  edited: any;
  editedList: any[] = [];
  filtersForm = this.fb.group({
    sex: [""],
    race: [""],
    age_min: [""],
    age_max: [""],
  });
  private readonly debTime = 1000;
  routeSub!: Subscription;
  filtersSub!: Subscription;

  constructor(
    public wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public afs: AngularFirestore,
    private destroyRef: DestroyRef
  ) {}

  handlePageEvent({ pageIndex }: PageEvent) {
    this.wantedService.data = null;
    this.wantedService.selectedPerson = null;
    this.wantedService.page = pageIndex + 1;
    this.router.navigate(["/content/crimes/wanted/", this.wantedService.page]);
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.wantedService.data[id];
  }

  resetFilters() {
    this.filtersForm.reset();
    this.wantedService.filters = {};
  }

  editHandle(value: { tr: any; $event: Event }) {
    value.$event.stopPropagation();
    this.dialog
      .open(EditCrimeComponent, {
        width: "50vw",
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: value.tr,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.wantedService
            .getEdited()
            .pipe(
              tap((ed) => {
                ed.forEach((doc) => {
                  let t = doc.data();
                  this.editedList.push(t["@id"]);
                });
              }),
              switchMap(() => this.wantedService.getData())
            )
            .subscribe((res) => {
              const prevSelected = this.wantedService.selectedPerson;
              this.wantedService.updateData(res);
              this.wantedService.selectedPerson = prevSelected;
              this.changeDetector.markForCheck();
            });
        }
      });
  }

  fetchData(): void {}
  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges
      .pipe(
        tap(() => (this.wantedService.fetching = true)),
        debounceTime(3000),
        switchMap((x) => {
          this.wantedService.updateFilters(x);
          return this.wantedService.getData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: any) => {
        this.wantedService.updateData(res);
        this.changeDetector.markForCheck();
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
        switchMap(() => this.wantedService.getEdited())
      )
      .pipe(
        tap((ed) => {
          ed.forEach((doc) => {
            let t = doc.data();
            this.editedList.push(t["@id"]);
          });
        }),
        switchMap(() => this.wantedService.getData()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        complete: () => console.log("dd"),
        next: (res: any) => {
          this.wantedService.updateData(res);
          this.changeDetector.markForCheck();
        },
      });
  }
  ngOnDestroy() {}
  viewInEdits(value: { tr: any; $event: Event }) {
    this.wantedService.selectedPerson = value.tr;
    value.$event.stopPropagation();
    this.router.navigate(["/content/crimes/edited"]);
    this.wantedService.editsOpenedFromGlobal = true;
  }
}
