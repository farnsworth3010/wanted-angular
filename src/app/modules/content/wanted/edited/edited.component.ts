import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { Crime } from '../../../../core/interfaces/crime';
import { WantedService } from '../../../../core/services/wanted.service';
import { isMobileWidth } from '../../../../core/utils/is-mobile';
import { DetailsDialogComponent } from '../../../../shared/dialogs/details-dialog/details-dialog.component';
import { EditCrimeComponent } from '../../../../shared/dialogs/edit-crime/edit-crime.component';
import { CriminalSkeletonComponent } from '../../../../shared/skeleton/criminal-skeleton/criminal-skeleton.component';
import { CriminalComponent } from '../criminal/criminal.component';
import { DetailsComponent } from '../details/details.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edited',
  standalone: true,
  imports: [CommonModule, DetailsComponent, CriminalComponent, MatProgressSpinnerModule, CriminalSkeletonComponent],
  templateUrl: './edited.component.html',
  styleUrl: './edited.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditedComponent implements OnInit {
  constructor(
    public wantedService: WantedService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  data: Crime[] = [];

  ngOnInit(): void {
    this.wantedService.fetchingItem.next(true);
    this.wantedService
      .getEdited()
      .pipe(delay(1000))
      .subscribe({
        next: (edited: DocumentData) => {
          this.wantedService.fetchingItem.next(false);
          edited['forEach']((doc: DocumentData, index: number) => {
            this.data.push(doc['data']());
          });

          if (this.wantedService.editsOpenedFromGlobalItem.value) {
            this.wantedService.editsOpenedFromGlobalItem.next(false);
            this.wantedService.selectedPerson = this.data.find(
              (obj: Crime) => obj.uid === this.wantedService.selectedPerson?.uid
            )!;
            if (isMobileWidth()) {
              this.openMobileDialog();
            }
          } else {
            this.wantedService.selectedPerson = this.data[0];
          }

          this.changeDetector.markForCheck();
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, 'dismiss', { duration: 3000 });
        },
      });
  }

  openMobileDialog(): void {
    this.dialog
      .open(DetailsDialogComponent, {
        width: '90vw',
        maxWidth: '90vw',
        height: '80vh',
        maxHeight: '80vh',
        enterAnimationDuration: 600,
        exitAnimationDuration: 300,
        autoFocus: false,
        data: this.wantedService.selectedPerson,
      })
      .afterClosed()
      .subscribe(editClick => {
        if (editClick) {
          this.editHandle(this.wantedService.selectedPerson!);
        }
      });
  }

  deletePerson(id: string) {
    this.data.find((obj: Crime) => id === obj.uid)!.deleting = true;
    this.changeDetector.markForCheck();
    this.wantedService.deleteEditedById(id).subscribe(() => {
      this.data = this.data.filter((obj: Crime) => id !== obj.uid);
      this.changeDetector.markForCheck();
    });
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
      .subscribe((res?: { wasEdited: boolean; data?: Crime }) => {
        if (res?.wasEdited) {
          const id = this.data.findIndex((obj: Crime) => res.data!.uid === obj.uid);
          const newData = this.data;
          newData[id] = { ...this.data[id], ...res.data! };
          this.data = newData;
          this.changeDetector.markForCheck();
        }
      });
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.data[id];
    if (isMobileWidth()) {
      this.openMobileDialog();
    }
    this.changeDetector.markForCheck();
  }
}
