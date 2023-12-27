import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { DetailsComponent } from "../details/details.component";
import { WantedService } from "../../../../core/services/wanted/wanted.service";

@Component({
  selector: "app-edited",
  standalone: true,
  imports: [CommonModule, DetailsComponent],
  templateUrl: "./edited.component.html",
  styleUrl: "./edited.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditedComponent implements OnInit{
  constructor(public wantedService: WantedService) {}
  edited: any;
  ngOnInit(): void {
    this.wantedService.data = null
  }
}
