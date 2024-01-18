import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WantedService } from '../../../../core/services/wanted.service';
import { DetailsComponent } from '../details/details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { CriminalComponent } from '../criminal/criminal.component';
import { Crime } from '../../../../core/interfaces/crime';
import { DocumentData } from '@angular/fire/compat/firestore';
import { CriminalSkeletonComponent } from '../../../../shared/skeleton/criminal-skeleton/criminal-skeleton.component';
import { isMobileWidth } from '../../../../core/utils/is-mobile';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../../../../shared/dialogs/details-dialog/details-dialog.component';

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
    private dialog: MatDialog
  ) {}

  data: Crime[] = [];

  ngOnInit(): void {
    this.wantedService.fetchingItem.next(true);
    this.wantedService
      .getEdited()
      .pipe(delay(1000))
      .subscribe((edited: DocumentData) => {
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
            this.dialog.open(DetailsDialogComponent, {
              width: '95vw',
              enterAnimationDuration: 300,
              exitAnimationDuration: 300,
              autoFocus: false,
              data: this.wantedService.selectedPerson,
            });
          }
        } else {
          this.wantedService.selectedPerson = this.data[0];
        }

        this.changeDetector.markForCheck();
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

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.data[id];
    this.changeDetector.markForCheck();
  }
}
