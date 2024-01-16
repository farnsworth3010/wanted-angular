import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WantedService } from '../../../../core/services/wanted/wanted.service';
import { DetailsComponent } from '../details/details.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { CriminalComponent } from '../criminal/criminal.component';
import { Crime } from '../../../../core/services/interfaces/crime';
import { DocumentData } from '@angular/fire/compat/firestore';
import { CriminalSkeletonComponent } from '../../../../shared/skeleton/criminal-skeleton/criminal-skeleton.component';

@Component({
  selector: 'app-edited',
  standalone: true,
  imports: [CommonModule, DetailsComponent, CriminalComponent, MatProgressSpinnerModule, CriminalSkeletonComponent],
  templateUrl: './edited.component.html',
  styleUrl: './edited.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditedComponent implements OnInit {
  constructor(public wantedService: WantedService, private changeDetector: ChangeDetectorRef) {}
  data: Crime[] = [];
  ngOnInit(): void {
    this.wantedService.fetching = true;
    if (this.wantedService.editsOpenedFromGlobal) {
      this.wantedService.data = null;
    }
    this.wantedService
      .getEdited()
      .pipe(delay(1000))
      .subscribe((edited: DocumentData) => {
        let oldData: Crime[] = [];
        if (this.data) {
          oldData = this.data;
        }
        this.data = [];
        this.wantedService.fetching = false;
        edited['forEach']((doc: DocumentData, index: number) => {
          this.data.push(doc['data']());
          if (oldData[index]?.deleting) {
            this.data[index].deleting = true;
          }
        });
        this.changeDetector.detectChanges();
        if (this.wantedService.editsOpenedFromGlobal) {
          this.wantedService.editsOpenedFromGlobal = false;
          this.wantedService.selectedPerson = this.data.find(
            (obj: Crime) => obj.uid === this.wantedService.selectedPerson?.uid
          )!;
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
