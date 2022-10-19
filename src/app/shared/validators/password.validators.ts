import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const controlValue: string = control.value;
  if (controlValue) {
    const haveCaps = RegExp('[A-Z]').test(controlValue);
    const haveSmallCase = RegExp('[a-z]').test(controlValue);
    const haveNumber = RegExp('\\d').test(controlValue);
    const excludesSpecialChar = RegExp('^[a-zA-Z0-9]*$').test(controlValue);
    const validationError = {
      password: {
        value: controlValue,
        errorMessage: '',
      },
    };
    if (!haveCaps) {
      validationError.password.errorMessage = 'Password should have at least one upper case letter';
    } else if (!haveSmallCase) {
      validationError.password.errorMessage = 'Password should have at least one lower case letter';
    } else if (!haveNumber) {
      validationError.password.errorMessage = 'Password should have at least one number';
    } else if (excludesSpecialChar) {
      validationError.password.errorMessage =
        'Password should have at least one special characters';
    } else {
      return null;
    }
    return validationError;
  } else {
    return null;
  }
}
