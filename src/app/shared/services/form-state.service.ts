import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  constructor() {}

  isFormPristine(formName: FormGroup): void {
    const defaultValue = formName.value;
    formName.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      if (JSON.stringify(defaultValue) === JSON.stringify(value)) {
        return formName.markAsPristine();
      }
    });
  }
}
