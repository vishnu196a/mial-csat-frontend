import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function uniqueValidator(control1: string, control2: string, prefix?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value1 = control.get(control1).value;
    const value2 = control.get(control2).value;
    const obj = {};
    obj[prefix ? `unique${prefix}` : 'unique'] = true;
    return value1 && value2 && value1 === value2 ? obj : null;
  };
}
