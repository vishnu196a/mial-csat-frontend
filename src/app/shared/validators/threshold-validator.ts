import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function thresholdValidator(fieldOne: string, fieldTwo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fieldOneValue = +control.get(fieldOne).value;
    const fieldTwoValue = +control.get(fieldTwo).value;
    return fieldTwoValue <= fieldOneValue ? { portMinMaxError: true } : null;
  };
}
