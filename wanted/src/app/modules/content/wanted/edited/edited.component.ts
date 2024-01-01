import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { WantedService } from "../../../../core/services/wanted/wanted.service";
import { DetailsComponent } from "../details/details.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { timeout } from "rxjs";
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
  ngOnInit(): void {
    this.wantedService.fetching = true;
    this.wantedService.data = null;
    this.wantedService
      .getEdited()
      .pipe(timeout(3000))
      .subscribe((res) => {
        this.wantedService.fetching = false;
        const temp: any[] = [];
        res.forEach((doc) => {
          temp.push(doc.data());
        });
        this.data = temp;
        this.wantedService.selectedPerson = this.data[0];
        this.changeDetector.detectChanges();
      });
  }
  selectPerson(id: number): void {
    this.wantedService.selectedPerson = this.data[id];
    this.changeDetector.detectChanges();
  }
}
