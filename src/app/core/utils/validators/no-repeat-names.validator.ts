import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomField } from '../../interfaces/custom-field';
import { BehaviorSubject } from 'rxjs';

export const noRepeatNamesValidator = (
  customFieldsSubject: BehaviorSubject<Record<string, CustomField>>
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const names: string[] = Object.keys(customFieldsSubject.value);
    const condition = names?.find(name => name === control.value);
    return condition ? { error: "You can't create repeated fields!" } : null;
  };
};
