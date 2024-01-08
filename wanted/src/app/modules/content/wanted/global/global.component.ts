import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from "@angular/core";
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
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from "@angular/material/dialog";
import { EditCrimeComponent } from "../../../../shared/dialogs/edit-crime/edit-crime.component";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { CriminalComponent } from "../criminal/criminal.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Crime } from "../../../../core/services/interfaces/crime";
import { NumberInput } from "@angular/cdk/coercion";
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
export class GlobalComponent implements OnInit {
  private readonly debTime = 1000;
  filtersForm = this.fb.group({
    sex: [""],
    race: [""],
    age_min: [""],
    age_max: [""],
  });
  filtersSub!: Subscription;
  editedList: any[] = [];
  routeSub!: Subscription;
  pageSize: NumberInput = 20;
  edited: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public wantedService: WantedService,
    private destroyRef: DestroyRef,
    public afs: AngularFirestore,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  handlePageEvent({ pageIndex }: PageEvent): void {
    this.wantedService.data = null;
    this.wantedService.selectedPerson = null;
    this.wantedService.page = pageIndex + 1;
    this.router.navigate(["/content/crimes/wanted/", this.wantedService.page]);
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.wantedService.data![id];
  }

  resetFilters(): void {
    this.filtersForm.reset();
    this.wantedService.filters = null;
  }

  editHandle(value: { tr: Crime; }) {
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
                ed.forEach((doc: any) => {
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
  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges
      .pipe(
        tap(() => (this.wantedService.fetching = true)),
        debounceTime(3000),
        switchMap((x: any) => {
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
          ed.forEach((doc: any) => {
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
  viewInEdits(value: { tr: any }) {
    this.wantedService.selectedPerson = value.tr;
    this.router.navigate(["/content/crimes/edited"]);
    this.wantedService.editsOpenedFromGlobal = true;
  }
}
