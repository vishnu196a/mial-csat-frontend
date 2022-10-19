import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { forEach } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Questions, SurveyFormDetails } from '../survey-list.model';
import { SurveyListService } from '../survey-list.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, OnDestroy {
  formId: number;
  isLoading: boolean = false;
  hasDetails: boolean = false;
  surveyFormDetails: SurveyFormDetails;
  private subscriptions = new Subscription();
  viewSurveyForm: FormGroup;
  starRating = 0;

  constructor(
    private surveyListService: SurveyListService,
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.params.id;
    this.viewSurveyForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      questions: this.formBuilder.array([]),
    });
    this.getFormDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  get formControls(): { [key: string]: AbstractControl } {
    return this.viewSurveyForm.controls;
  }
  get questionsFormControl(): FormArray {
    return this.viewSurveyForm.get('questions') as FormArray;
  }
  getFormDetails(): void {
    this.isLoading = true;
    const observer = this.surveyListService.getSurveyFormDetails(this.formId).subscribe(
      (surveyFormResponse: SurveyFormDetails) => {
        this.surveyFormDetails = surveyFormResponse;
        this.setQuestions(surveyFormResponse);

        this.hasDetails = true;
        this.isLoading = false;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasDetails = false;
        this.isLoading = false;
        this.router.navigate(['/survey_form_list']);
      }
    );
    this.subscriptions.add(observer);
  }
  setQuestions(formDetails: SurveyFormDetails): void {
    const viewFormControls = this.viewSurveyForm.controls.questions as FormArray;
    viewFormControls.clear();
    let multiOption = [];

    forEach(formDetails.questions, (questions) => {
      if (questions.multi_select) {
        multiOption = [];
        questions.multi_select.forEach((option) => {
          multiOption.push({ isDisabled: false, isSelected: false, value: option });
        });
      }
      viewFormControls.push(
        this.formBuilder.group({
          question: [questions.question],
          options: [questions.option],
          ratings: [questions.ratings],
          multi_select: [multiOption],
          type: [questions.type],
          dependent_questions: this.setDependentQuestions(questions.dependent_questions),
          optionText: null,
        })
      );
    });
  }
  setDependentQuestions(dependent_question: Questions[]): FormArray {
    if (dependent_question) {
      const setFormArray = new FormArray([]);
      dependent_question.forEach((form) => {
        form.isVisible = false;
        setFormArray.push(this.formBuilder.group(form));
      });
      return setFormArray;
    }
  }
  onFormSubmit(): void {}
  checked(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const multiSelectControl = formGroup.controls.multi_select as FormControl;
    const dependentControl = formGroup.controls.dependent_questions as FormArray;
    const optionValue = multiSelectControl.value[index];
    optionValue.isSelected = !optionValue.isSelected;
    let count = 0;
    multiSelectControl.value.forEach((element) => {
      if (element.isSelected) {
        count += 1;
      }
    });
    if (count > 2) {
      multiSelectControl.value.forEach((element) => {
        if (!element.isSelected) {
          element.isDisabled = true;
        }
      });
    } else {
      multiSelectControl.value.forEach((element) => {
        element.isDisabled = false;
      });
    }
    dependentControl.value.forEach((question) => {
      if (question.option === optionValue.value) {
        question.isVisible = !question.isVisible;
      }
    });
  }
  getDependentQuestions(form): FormControl {
    return form.controls.dependent_questions.controls;
  }

  optionChange(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const optionControl = formGroup.controls.options as FormControl;
    const dependentControl = formGroup.controls.dependent_questions as FormArray;
    const optionValue = optionControl.value[index];

    dependentControl.value.forEach((question) => {
      if (question.option === optionValue) {
        question.isVisible = !question.isVisible;
      } else {
        question.isVisible = false;
      }
    });
  }
}
