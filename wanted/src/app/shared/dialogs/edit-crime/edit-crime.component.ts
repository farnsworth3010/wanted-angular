import { ChangeDetectionStrategy, Component, Inject, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { addDoc, collection } from "@angular/fire/firestore";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { from } from "rxjs";
import { WantedService } from "../../../core/services/wanted/wanted.service";
@Component({
  selector: "app-edit-crime",
  standalone: true,
  imports: [MatButtonToggleModule, MatButtonModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./edit-crime.component.html",
  styleUrl: "./edit-crime.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCrimeComponent implements OnInit {
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public afs: AngularFirestore, public ws: WantedService) {}
  async sendRequest() {
    const test = from(
      addDoc(collection(this.afs.firestore, "edited"), {
        ...this.data,
        title: this.firstFormGroup.controls.title.value,
        sex: this.firstFormGroup.controls.sex.value,
        hair: this.firstFormGroup.controls.hair.value,
        race: this.firstFormGroup.controls.race.value,
        eyes: this.firstFormGroup.controls.eyes.value,
        reward: this.firstFormGroup.controls.reward.value,
      })
    );
    test.subscribe(()=> {
    })
  }
  ngOnInit(): void {}

  firstFormGroup = this.fb.group({
    title: [this.data.title ?? "-", Validators.required],
    sex: [this.data.sex ?? "Male"],
    hair: [this.data.hair ?? "-"],
    race: [this.data.race ?? "-"],
    eyes: [this.data.eyes ?? "-"],
    reward: [this.data.reward ?? "-"],
  });
  secondFormGroup = this.fb.group({
    test: [""],
  });
}
