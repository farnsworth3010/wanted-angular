import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { addDoc, collection } from "@angular/fire/firestore";
import { AbstractControl, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { from } from "rxjs";
import { WantedService } from "../../../core/services/wanted/wanted.service";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-edit-crime",
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: "./edit-crime.component.html",
  styleUrl: "./edit-crime.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCrimeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public afs: AngularFirestore,
    public ws: WantedService,
  ) { }

  sendRequest(): void {
    if (this.addFieldFormGroup.valid) {
      this.customFieldsData = this.customFields.map((x, index) => {
        return {
          name: x.name,
          value: this.additional.value[index],
        };
      });
      from(
        addDoc(collection(this.afs.firestore, "edited"), {
          ...this.data,
          title: this.firstFormGroup.controls.title.value,
          sex: this.firstFormGroup.controls.sex.value,
          hair: this.firstFormGroup.controls.hair.value,
          race: this.firstFormGroup.controls.race.value,
          eyes: this.firstFormGroup.controls.eyes.value,
          reward: this.firstFormGroup.controls.reward.value,
          customFields: this.customFieldsData,
        })
      ).subscribe(() => { });
    }
  }
  addFieldFormGroup = this.fb.group({
    type: ["", Validators.required],
    name: ["", this.noRepeatNamesValidator()],
  });
  customFields: any[] = [];
  customFieldsData: any[] = [];

  noRepeatNamesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const condition = this.customFields?.find((x) => x.name === control.value);
      return condition ? { error: "gg" } : null;
    };
  }

  addField() {
    if (this.addFieldFormGroup.valid && this.customFields.length < 3 && this.addFieldFormGroup.controls.name.value) {
      const control = this.fb.control("");
      this.customFields.push({ name: this.addFieldFormGroup.controls.name.value, type: this.addFieldFormGroup.controls.type.value, isEditing: false });
      this.secondFormGroup.controls.additional.push(control);
      this.addFieldFormGroup.controls.name.reset();
    }
  }

  firstFormGroup = this.fb.group({
    title: [this.data.title ?? "-", Validators.required],
    sex: [this.data.sex ?? "Male", Validators.required],
    hair: [this.data.hair],
    race: [this.data.race],
    eyes: [this.data.eyes],
    reward: [this.data.reward],
    additional: this.fb.array([]),
  });

  get additional(): FormArray {
    return this.secondFormGroup.get("additional") as FormArray;
  }

  secondFormGroup = this.fb.group({
    additional: this.fb.array([]),
  });

  toggleFieldEditById(id: number): void {
    this.customFields[id].isEditing = !this.customFields[id].isEditing;
  }

  deleteCustomFieldById(id: number): void {
    this.secondFormGroup.controls.additional.removeAt(id);
  }

  applyEditById(id: number, name: string, type: string): void {
    if (name && type) {
      this.customFields.at(id).name = name;
      this.customFields.at(id).type = type;
      this.customFields.at(id).isEditing = false;
    }
  }
}
