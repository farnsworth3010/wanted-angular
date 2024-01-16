import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WantedService } from '../../../../core/services/wanted.service';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { DetailsComponent } from '../details/details.component';
import { Subscription, debounceTime, switchMap, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialog, MatDialogActions, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { EditCrimeComponent } from '../../../../shared/dialogs/edit-crime/edit-crime.component';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { CriminalComponent } from '../criminal/criminal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Crime } from '../../../../core/interfaces/crime';
import { NumberInput } from '@angular/cdk/coercion';
import { WantedRes } from '../../../../core/interfaces/wantedResult';
import { CriminalSkeletonComponent } from '../../../../shared/skeleton/criminal-skeleton/criminal-skeleton.component';
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
    private router: Router
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
    this.wantedService.page = pageIndex + 1;
    this.router.navigate(['/content/crimes/wanted/', this.wantedService.page]);
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.wantedService.data![id];
  }

  editHandle(tr: Crime) {
    this.dialog
      .open(EditCrimeComponent, {
        width: '50vw',
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: tr,
      })
      .afterClosed()
      .subscribe((wasEdited: boolean) => {
        // mutation убрать
        if (wasEdited) this.editedIds.push(tr.uid);
        this.changeDetector.markForCheck();
      });
  }

  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges
      .pipe(
        tap(() => (this.wantedService.fetching = true)),
        // fetching - behaviour subject
        debounceTime(1000),
        switchMap(() => {
          this.wantedService.updateFilters(this.filtersForm.value);
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
          this.wantedService.fetching = true;
          if (Number(map.get('id'))) {
            this.wantedService.page = Number(map.get('id'));
            // page убрать
            this.wantedService.pageItem.next(this.wantedService.page); // needed to update links in content.ts
          }
        }),
        debounceTime(this.debTime),
        switchMap(() => this.wantedService.getEdited())
      )
      .pipe(
        tap((edited: DocumentData) => {
          console.log(edited);
          edited['forEach']((doc: DocumentData) => {
            let data = doc['data']();
            this.editedIds.push(data['uid']);
            // mutation
          });
        }),
        switchMap(() => this.wantedService.getData()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res: WantedRes) => {
          this.wantedService.updateData(res);
          this.changeDetector.markForCheck();
        },
        complete: () => {
          this.wantedService.filters = null;
        },
      });
  }
  viewInEdits(tr: Crime) {
    this.wantedService.selectedPerson = tr;
    // behavioursubject
    this.wantedService.editsOpenedFromGlobal = true;
    this.router.navigateByUrl('/content/crimes/edited');
  }
}
