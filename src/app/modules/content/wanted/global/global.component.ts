import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WantedService } from '../../../../core/services/wanted.service';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { Subscription, debounceTime, switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialog, MatDialogActions, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { EditCrimeComponent } from '../../../../shared/dialogs/edit-crime/edit-crime.component';
import { DocumentData } from '@angular/fire/compat/firestore';
import { CriminalComponent } from '../criminal/criminal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Crime } from '../../../../core/interfaces/crime';
import { NumberInput } from '@angular/cdk/coercion';
import { WantedRes } from '../../../../core/interfaces/wanted-result';
import { CriminalSkeletonComponent } from '../../../../shared/skeleton/criminal-skeleton/criminal-skeleton.component';
import { isMobileWidth } from '../../../../core/utils/is-mobile';
import { DetailsComponent } from '../details/details.component';
import { DetailsDialogComponent } from '../../../../shared/dialogs/details-dialog/details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-global',
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
    DetailsComponent,
    MatSelectModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    CriminalComponent,
    CriminalSkeletonComponent,
  ],
  templateUrl: './global.component.html',
  styleUrl: './global.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalComponent implements OnInit {
  constructor(
    private changeDetector: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public wantedService: WantedService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  debTime = 1000;
  filtersForm = this.fb.group({
    sex: [''],
    race: [''],
    age_min: [''],
    age_max: [''],
  });
  filtersSub!: Subscription;
  routeSub!: Subscription;
  pageSize: NumberInput = 20;
  editedIds: string[] = [];
  edited!: Crime[];

  handlePageEvent({ pageIndex }: PageEvent): void {
    this.wantedService.data = null;
    this.wantedService.selectedPerson = null;
    this.router.navigate(['/content/crimes/wanted/', pageIndex + 1]);
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.wantedService.data![id];
    if (isMobileWidth()) {
      this.dialog
        .open(DetailsDialogComponent, {
          width: '90vw',
          maxWidth: '90vw',
          height: '80vh',
          maxHeight: '80vh',
          enterAnimationDuration: 300,
          exitAnimationDuration: 300,
          autoFocus: false,
          data: this.wantedService.selectedPerson,
        })
        .afterClosed()
        .subscribe(editClicked => {
          if (editClicked) {
            this.editHandle(this.wantedService.selectedPerson!);
          }
        });
    }
  }

  editHandle(tr: Crime) {
    this.dialog
      .open(EditCrimeComponent, {
        width: isMobileWidth() ? '90vw' : '50vw',
        maxWidth: '90vw',
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: tr,
      })
      .afterClosed()
      .subscribe((value?: { wasEdited?: boolean }) => {
        const newEdited = this.editedIds;

        if (value?.wasEdited) {
          newEdited.push(tr.uid);
        }

        this.editedIds = newEdited;
        this.changeDetector.markForCheck();
      });
  }
  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges
      .pipe(
        tap(() => this.wantedService.fetchingItem.next(true)),
        debounceTime(1000),
        switchMap(() => {
          this.wantedService.updateFilters(this.filtersForm.value);
          this.router.navigate(['/content/crimes/wanted/', 1]);
          return this.wantedService.getData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: WantedRes) => {
        this.wantedService.updateData(res);
        this.changeDetector.markForCheck();
      });

    this.routeSub = this.activatedRoute.paramMap
      .pipe(
        tap((map: ParamMap) => {
          this.wantedService.fetchingItem.next(true);
          this.changeDetector.markForCheck();
          if (Number(map.get('id'))) {
            this.wantedService.pageItem.next(Number(map.get('id')));
          } else {
            this.wantedService.pageItem.next(1);
          }
        }),
        debounceTime(this.debTime),
        switchMap(() => this.wantedService.getEdited())
      )
      .pipe(
        tap((edited: DocumentData) => {
          const newEditedIds = this.editedIds;
          edited['forEach']((doc: DocumentData) => {
            let data = doc['data']();
            newEditedIds.push(data['uid']);
          });
          this.editedIds = newEditedIds;
        }),
        switchMap(() => this.wantedService.getData()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: WantedRes) => {
          this.wantedService.updateData(res);
          this.changeDetector.markForCheck();
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
        },
        complete: () => {
          this.wantedService.filters = null;
        },
      });
  }

  viewInEdits(tr: Crime) {
    this.wantedService.selectedPerson = tr;

    this.wantedService.editsOpenedFromGlobalItem.next(true);

    this.router.navigateByUrl('/content/crimes/edited');
  }
}
