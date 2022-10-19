import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  SURVEY_DEFAULT_QUESTIONS,
  SURVEY_RATINGS,
  SURVEY_TYPES,
} from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AddSurveyForm } from '../survey-list.model';
import { SurveyListService } from '../survey-list.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddFormComponent implements OnInit {
  types = SURVEY_TYPES;
  ratings = SURVEY_RATINGS;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  subscriptions = new Subscription();
  addSurveyForm: FormGroup;

  constructor(
    private surveyListService: SurveyListService,
    private router: Router,
    private toasterService: ToastrService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.addSurveyForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      questions: this.formBuilder.array([]),
    });
    this.initializeForm();
  }
  initializeForm(): void {
    const addFormControls = this.addSurveyForm.controls.questions as FormArray;
    SURVEY_DEFAULT_QUESTIONS.forEach((formData) => {
      addFormControls.push(this.formBuilder.group(formData));
    });
    addFormControls.push(
      this.formBuilder.group({
        id: [3],
        question: [null, [Validators.required]],
        type: [null, Validators.required],
        option: [null],
        ratings: [null],
        multi_select: [null],
        dependent_questions: this.formBuilder.array([]),
        optionText: [null],
        multiOptionText: [null],
      })
    );
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addSurveyForm.controls;
  }
  get questionsFormControl(): FormArray {
    return this.addSurveyForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    const addFormControls = this.addSurveyForm.controls.questions as FormArray;
    addFormControls.push(
      this.formBuilder.group({
        id: [addFormControls.length + 1],
        question: [null, [Validators.required]],
        type: [null, Validators.required],
        option: [null],
        ratings: [null],
        multi_select: [null],
        dependent_questions: this.formBuilder.array([]),
        optionText: [null],
        multiOptionText: [null],
      })
    );
  }
  removeQuestion(index: number): void {
    const addFormControls = this.addSurveyForm.controls.questions as FormArray;
    addFormControls.removeAt(index);
  }
  onFormSubmit(): void {
    this.isLoading = true;
    const questions = [...this.addSurveyForm.get('questions').value];
    questions.forEach((question) => delete question['id']);
    questions.forEach((question) => delete question['multiOptionText']);
    questions.forEach((question) => delete question['optionText']);
    questions.push({
      dependent_questions: [],
      multi_select: null,
      option: null,
      question:
        'We’d love to hear if there is anything else that could have improved your experience',
      ratings: null,
      type: 'Free Text',
    });

    const addForm: AddSurveyForm = {
      name: this.addSurveyForm.value.name,
      questions: questions,
    };

    const observer = this.surveyListService.addForm(addForm).subscribe(
      () => {
        this.isLoading = false;
        this.toasterService.success('Survey form added successfully');
        this.router.navigate(['/survey_form']);
      },
      (error: ErrorResponse) => {
        this.isLoading = false;
        if (error.hasValidationError) {
          this.hasValidationError = true;
          this.validationErrors = error.errorList;
          window.scrollTo({ top: 0 });
        } else {
          this.hasValidationError = false;
          this.toasterService.error(error.message);
        }
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  addOption(index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[index] as FormGroup;
    const option = this.questionsFormControl.value[index].optionText.trim() as string;
    const optionControl = formGroup.controls.option as FormControl;
    const optionTextControl = formGroup.controls.optionText as FormControl;
    let options: string[] = [];
    if (optionTextControl.value.trim()) {
      options = optionControl.value || [];
      if (!options.includes(option)) {
        options.push(option);
        optionControl.setValue([...options]);
        optionControl.updateValueAndValidity();

        optionTextControl.reset();
      }
    }
  }

  removeOption(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const optionControl = formGroup.controls.option as FormControl;
    optionControl.value.splice(index, 1);
  }

  typeChanged(index: number): void {
    const type = this.questionsFormControl.value[index].type;
    const formGroup: FormGroup = this.questionsFormControl.controls[index] as FormGroup;
    formGroup.controls.option.clearValidators();
    formGroup.controls.option.reset();
    formGroup.controls.option.updateValueAndValidity();
    formGroup.controls.ratings.clearValidators();
    formGroup.controls.ratings.reset();
    formGroup.controls.ratings.updateValueAndValidity();
    formGroup.controls.multi_select.clearValidators();
    formGroup.controls.multi_select.reset();
    formGroup.controls.multi_select.updateValueAndValidity();
    const addDependent = formGroup.controls.dependent_questions as FormArray;
    addDependent.controls = [];
    addDependent.updateValueAndValidity();
    if (type === 'Options') {
      formGroup.controls.option.setValidators([Validators.required]);
      formGroup.controls.option.updateValueAndValidity();
    } else if (type === 'Ratings') {
      formGroup.controls.ratings.setValidators([Validators.required]);
      formGroup.controls.ratings.updateValueAndValidity();
    } else if (type === 'Multi Select') {
      formGroup.controls.multi_select.setValidators([Validators.required]);
      formGroup.controls.multi_select.updateValueAndValidity();
    }
  }
  addMultiSelectOption(index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[index] as FormGroup;
    const option = this.questionsFormControl.value[index].multiOptionText.trim() as string;
    const multiOptionControl = formGroup.controls.multi_select as FormControl;
    const multiOptionTextControl = formGroup.controls.multiOptionText as FormControl;
    let multiSelectOptions: string[] = [];
    if (multiOptionTextControl.value.trim()) {
      multiSelectOptions = multiOptionControl.value || [];
      if (!multiSelectOptions.includes(option)) {
        multiSelectOptions.push(option);
        multiOptionControl.setValue([...multiSelectOptions]);
        multiOptionControl.updateValueAndValidity();
        multiOptionTextControl.reset();
      }
    }
  }
  removeMultiOption(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const optionControl = formGroup.controls.multi_select as FormControl;
    optionControl.value.splice(index, 1);
  }

  addDependent(index: number, option: string): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[index] as FormGroup;
    const addDependent = formGroup.controls.dependent_questions as FormArray;
    addDependent.push(
      this.formBuilder.group({
        id: [addDependent.length + 1],
        question: [null, [Validators.required]],
        type: ['Ratings', Validators.required],
        option: [option],
        ratings: [5],
        multi_select: [null],
        optionText: [null],
        multiOptionText: [null],
      })
    );
  }

  getDependentQuestions(form): FormControl {
    return form.controls.dependent_questions.controls;
  }
  removeDependentQuestion(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const addDependent = formGroup.controls.dependent_questions as FormArray;
    addDependent.removeAt(index);
  }
}
