import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AbstractControl, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatStepperModule } from "@angular/material/stepper";
import { from } from "rxjs";
import { WantedService } from "../../../core/services/wanted/wanted.service";
import { CommonModule } from "@angular/common";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { Crime } from "../../../core/services/interfaces/crime";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    @Inject(MAT_DIALOG_DATA) public data: Crime,
    private fb: FormBuilder,
    public afs: AngularFirestore,
    public ws: WantedService,
    private dialog: MatDialogRef<EditCrimeComponent>,
    private snackBar: MatSnackBar
  ) { }

  customForm = this.fb.group({
    title: [this.data.title ?? "-", Validators.required],
    sex: [this.data.sex ?? "Male", Validators.required],
    hair: [this.data.hair],
    race: [this.data.race],
    eyes: [this.data.eyes],
    reward_text: [this.data.reward_text],
  })
  addFieldForm = this.fb.group({
    type: ["", Validators.required],
    name: ["", [Validators.required, this.noRepeatNamesValidator()]],
    fields: this.fb.array([])
  })

  customFields: any[] = [];

  sendRequest(): void {
    const oldData = {
      title: this.data.title,
      sex: this.data.sex,
      hair: this.data.hair,
      race: this.data.race,
      eyes: this.data.eyes,
      reward_text: this.data.reward_text,
    }
    const newData = {
      title: this.customForm.controls.title.value,
      sex: this.customForm.controls.sex.value,
      hair: this.customForm.controls.hair.value,
      race: this.customForm.controls.race.value,
      eyes: this.customForm.controls.eyes.value,
      reward_text: this.customForm.controls.reward_text.value,
    }
    if (JSON.stringify(oldData) !== JSON.stringify(newData) || this.addFieldForm.controls.fields.length) {
      this.dialog.close(true)
      this.snackBar.dismiss()
      from(
        this.afs.collection('edited').doc(this.data['uid']).set({
          ...this.data,
          ...newData,
          customFields: this.customFields.map((name: string, index: number) => {
            return {
              name,
              value: this.addFieldForm.controls.fields.value[index],
            };
          })
        })
      )
    } else {
      this.snackBar.open("You haven't changed anything!", '', { duration: 3000 })
    }
  }


  addField() {
    if (this.addFieldForm.controls.name.valid && this.addFieldForm.controls.type.valid && this.addFieldForm.controls.fields.length < 3) {
      if (this.addFieldForm.controls.name.value) {
      const control = this.fb.control("", Validators.required);
      this.customFields.push({ name: this.addFieldForm.controls.name.value, type: this.addFieldForm.controls.type.value, isEditing: false });

      this.addFieldForm.controls.fields.push(control);
      this.addFieldForm.controls.name.reset();
      this.addFieldForm.controls.name.setErrors(null);

      } 
      else {
        this.addFieldForm.controls.name.setErrors({error: 'invalid'});
      }
    }
  }

  toggleFieldEditById(id: number): void {
    this.customFields[id].isEditing = !this.customFields[id].isEditing;
  }

  deleteCustomFieldById(id: number): void {
    this.addFieldForm.controls.fields.removeAt(id);
  }
  applyEditById(id: number, nameInput: HTMLInputElement, typeInput: MatSelect): void {
    if (nameInput.value && typeInput.value) {
      this.customFields[id].name = nameInput.value;
      this.customFields[id].type = typeInput.value;
      this.customFields[id].isEditing = false;
    }
    else {
      nameInput.setCustomValidity('sdf')
    }
  }

  noRepeatNamesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const condition = this.customFields?.find((x) => x.name === control.value);
      return condition ? { error: "You can't create repeated fields!" } : null;
    };
  }
}
