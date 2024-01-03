import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DefaultFieldValuePipe } from "../../../../shared/pipes/default-field-value.pipe";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ImageFallbackDirective } from "../../../../shared/directives/image-fallback.directive";

@Component({
  selector: "app-criminal",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, DefaultFieldValuePipe, MatButtonModule, ImageFallbackDirective],
  templateUrl: "./criminal.component.html",
  styleUrl: "./criminal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriminalComponent implements OnInit {
  @Input() tr: any;
  @Input() openToDelete: boolean = false;
  @Input() openToEdit: boolean = false;
  @Input() i: number = 0;
  @Output() personClick = new EventEmitter();
  @Output() selectClick = new EventEmitter();
  @Output() deleteClick = new EventEmitter();
  @Output() editClick = new EventEmitter();
  @Output() viewInEditsClick = new EventEmitter();
  @Input() edited: boolean = false;
  @Input() firebaseId!: string;
  public selectPerson(i: number) {
    this.personClick.emit(i);
  }
  public editHandle($event: Event, tr: any) {
    this.editClick.emit({ $event, tr });
  }
  public deleteHandle($event: Event) {
    this.deleteClick.emit({ $event, id: this.firebaseId });
  }
  public viewInEditsHandle($event: Event, tr: any) {
    this.viewInEditsClick.emit({ $event, tr });
  }
  ngOnInit(): void {}
}
