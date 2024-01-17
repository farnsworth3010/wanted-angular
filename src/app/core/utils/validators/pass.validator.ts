import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passValidator = (): ValidatorFn => {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    const firctCtrl = abstractControl.get('password');
    const secondCtrl = abstractControl.get('passwordConfirm');

    if (firctCtrl?.value !== secondCtrl?.value) {
      secondCtrl?.setErrors({
        ...secondCtrl.errors,
        confirmedValidator: 'Passwords do not match',
      });
      return { confirmedValidator: 'Passwords do not match' };
    }

    secondCtrl?.setErrors(null);
    return null;
  };
};
