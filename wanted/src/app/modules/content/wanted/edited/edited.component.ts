import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { WantedService } from "../../../../core/services/wanted/wanted.service";
import { DetailsComponent } from "../details/details.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Observable, catchError, delay, of } from "rxjs";
import { CriminalComponent } from "../criminal/criminal.component";
import { Crime } from "../../../../core/services/interfaces/crime";
import { DocumentData } from "@angular/fire/compat/firestore";

@Component({
  selector: "app-edited",
  standalone: true,
  imports: [CommonModule, DetailsComponent, CriminalComponent, MatProgressSpinnerModule],
  templateUrl: "./edited.component.html",
  styleUrl: "./edited.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditedComponent implements OnInit {
  constructor(public wantedService: WantedService, private changeDetector: ChangeDetectorRef) { }

  data: Crime[] = [];

  fetchData(): void {
    if (this.wantedService.editsOpenedFromGlobal) {
      this.wantedService.data = null;
    }
    this.wantedService
      .getEdited()
      .pipe(delay(1000))
      .subscribe((edited: Crime[]) => {
        let oldData: Crime[] = [];
        if (this.data) {
          oldData = this.data
        }
        this.data = [];
        this.wantedService.fetching = false;
        edited.forEach((doc: DocumentData, index) => {
          this.data.push(doc['data']());
          if (oldData[index]?.deleting) {
            this.data[index].deleting = true
          }
        });
        this.changeDetector.detectChanges()

        if (this.wantedService.editsOpenedFromGlobal) {
          this.wantedService.editsOpenedFromGlobal = false;
          this.wantedService.selectedPerson = this.data.find((obj: Crime) => obj.uid === this.wantedService.selectedPerson?.uid)!
        } else {
          this.wantedService.selectedPerson = this.data[0];
        }
        this.changeDetector.markForCheck();
      });
  }

  ngOnInit(): void {
    this.wantedService.fetching = true;
    this.fetchData();
  }

  deletePerson(id: string) {
    this.data.find((obj: Crime) => id === obj.uid)!.deleting = true;
    this.changeDetector.markForCheck()
    this.wantedService.deleteEditedById(id).subscribe(() => {
      this.fetchData();
    });
  }

  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.data[id];
    this.changeDetector.markForCheck();
  }
}
