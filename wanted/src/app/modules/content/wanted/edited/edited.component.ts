import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { WantedService } from "../../../../core/services/wanted/wanted.service";
import { DetailsComponent } from "../details/details.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { delay, timeout } from "rxjs";
import { CriminalComponent } from "../criminal/criminal.component";

@Component({
  selector: "app-edited",
  standalone: true,
  imports: [CommonModule, DetailsComponent, CriminalComponent, MatProgressSpinnerModule],
  templateUrl: "./edited.component.html",
  styleUrl: "./edited.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditedComponent implements OnInit {
  constructor(public wantedService: WantedService, private changeDetector: ChangeDetectorRef) {}
  data: any;
  fetchData(): void {
    this.wantedService.fetching = true;
    this.wantedService.data = null;
    this.wantedService
      .getEdited()
      .pipe(delay(1000))
      .subscribe((res) => {
        this.wantedService.fetching = false;
        const temp: any[] = [];
        res.forEach((doc) => {
          temp.push({ data: doc.data(), id: doc.id });
        });
        this.data = temp;
        if (this.wantedService.editsOpenedFromGlobal) {
          this.wantedService.editsOpenedFromGlobal = false;
          this.wantedService.selectedPerson = this.data.find((obj: any)=>obj.data.uid === this.wantedService.selectedPerson.uid).data
        } else {
          this.wantedService.selectedPerson = this.data[0]?.data;
        }
        this.changeDetector.detectChanges();
      });
  }
  ngOnInit(): void {
    this.fetchData();
  }
  deletePerson({ $event, id }: { $event: Event; id: string }) {
    $event.stopPropagation();
    this.wantedService.deleteEditedById(id).subscribe((res) => {
      this.fetchData();
    });
  }
  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.data[id]?.data;
    this.changeDetector.detectChanges();
  }
}
