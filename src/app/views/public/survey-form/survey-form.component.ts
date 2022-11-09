import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardState, CardStates } from '@public/survey-form/survey-form.model';
import {
  Questions,
  SurveyInvitationForm,
  SurveyResponseForm,
} from '@public/survey-form/survey-form.model';
import { SurveyListService } from '@public/survey-form/survey-form.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { forEach } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './survey-form.component.html',
  styleUrls: ['../authentication/forgot-password/forgot-password.component.scss'],

  animations: [
    trigger('cardFlip', [
      state(
        CardStates.DEFAULT,
        style({
          transform: 'none',
        })
      ),
      state(
        CardStates.FLIPPED,
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      transition(`${CardStates.DEFAULT} <=> ${CardStates.FLIPPED}`, animate(400)),
    ]),
  ],
})
export class SurveyFormComponent implements OnInit, OnDestroy {
  hasDetails: boolean = false;
  isResponseSubmitted = false;
  data: CardState = {
    state: CardStates.DEFAULT,
  };
  resetPwdForm: FormGroup;
  invitationToken: string;
  subscriptions = new Subscription();
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  formId: number;
  surveyFormDetails: SurveyInvitationForm;
  viewSurveyForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private surveyService: SurveyListService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.invitationToken = this.activatedRoute.snapshot.queryParams['invitation_token'];
    this.viewSurveyForm = this.formBuilder.group({
      name: [null],
      questions: this.formBuilder.array([]),
    });
    this.getInvitationForm();
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
  getInvitationForm(): void {
    this.isLoading = true;
    const observer = this.surveyService.getSurveyInvitationForm(this.invitationToken).subscribe(
      (surveyForm: SurveyInvitationForm) => {
        this.surveyFormDetails = surveyForm;

        this.setQuestions(surveyForm);
        this.hasDetails = true;
        this.isLoading = false;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasDetails = false;
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  setQuestions(formDetails: SurveyInvitationForm): void {
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
          rating: questions.type === 'Ratings' ? [null, [Validators.required]] : null,
          options: questions.type === 'Options' ? [questions.option] : null,
          ratings: [questions.ratings],
          multi_select: questions.type === 'Multi Select' ? [multiOption] : null,
          multi_selected: questions.type === 'Multi Select' ? [null, [Validators.required]] : null,
          option_selected: questions.type === 'Options' ? [null, [Validators.required]] : null,
          multi_option_rating: null,
          option_rating: null,
          type: [questions.type],
          dependent_questions: this.setDependentQuestions(questions.dependent_questions),

          optionText: null,
          answer: questions.type === 'Free Text' ? [null, [Validators.required]] : null,
        })
      );
    });
  }
  setDependentQuestions(dependent_question: Questions[]): FormArray {
    if (dependent_question) {
      const setFormArray = new FormArray([]);
      dependent_question.forEach((form) => {
        form.isVisible = false;
        form.rate = null;
        setFormArray.push(this.formBuilder.group(form));
      });
      return setFormArray;
    }
  }
  checked(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const multiSelectControl = formGroup.controls.multi_select as FormControl;
    const multiSelectedControl = formGroup.controls.multi_selected as FormControl;
    const dependentControl = formGroup.controls.dependent_questions as FormArray;
    const optionValue = multiSelectControl.value[index];
    optionValue.isSelected = !optionValue.isSelected;
    let count = 0;
    const selected = [];
    multiSelectControl.value.forEach((element) => {
      if (element.isSelected) {
        selected.push(element.value);
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

    multiSelectedControl.setValue([...selected]);
  }
  getDependentQuestions(form): FormControl {
    return form.controls.dependent_questions.controls;
  }

  optionChange(formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const optionControl = formGroup.controls.options as FormControl;
    const optionSelectedControl = formGroup.controls.option_selected as FormControl;
    const dependentControl = formGroup.controls.dependent_questions as FormArray;
    const optionValue = optionControl.value[index];

    dependentControl.value.forEach((question) => {
      if (question.option === optionValue) {
        question.isVisible = !question.isVisible;
      } else {
        question.isVisible = false;
      }
    });
    optionSelectedControl.setValue(optionValue);
  }
  onFormSubmit(): void {
    const response = this.viewSurveyForm.value.questions;
    const answers = response.map((x) => Object.assign({}, x));
    answers.forEach((question) => {
      question.max_score = question.ratings;
      question.multi_select = question.multi_selected;
      question.option = question.option_selected;
      delete question['option_selected'];
      delete question['options'];
      delete question['multi_selected'];
      delete question['ratings'];
      delete question['optionText'];
      if (question.type === 'Options' || question.type === 'Multi Select') {
        question.max_score = '5';
      }
      if (question.multi_option_rating) {
        const ratings = [];
        question.multi_select.forEach((opt) => {
          ratings.push(question.multi_option_rating[0][opt]);
        });
        question.multi_option_rating = ratings;
      }
      if (question.dependent_questions && question.dependent_questions.length > 0) {
        question.dependent_question = question.dependent_questions.filter((data) => {
          return data.isVisible;
        });
        question.dependent_questions = question.dependent_question;
        delete question['dependent_question'];
        question.dependent_questions.forEach((dQuestion) => {
          dQuestion.max_score = dQuestion.ratings;
          dQuestion.ratings = dQuestion.rate;
          delete dQuestion['rate'];
          delete dQuestion['isVisible'];
        });
      } else {
        question.dependent_questions = null;
      }
    });
    const addResponse: SurveyResponseForm = {
      responses: answers,
      survey_form_id: this.surveyFormDetails.survey_form_id,
      survey_form_invitation_id: this.surveyFormDetails.survey_form_invitation_id,
    };

    const observer = this.surveyService.addSurveyResponse(addResponse).subscribe(
      () => {
        this.data.state = CardStates.FLIPPED;
        this.isResponseSubmitted = true;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasDetails = false;
        this.isLoading = false;
        this.isResponseSubmitted = false;
        this.data.state = CardStates.DEFAULT;
      }
    );
    this.subscriptions.add(observer);
  }
  depRateChange(rateValue: number, formIndex: number, index: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const dependentControl = formGroup.controls.dependent_questions as FormArray;
    dependentControl.value[index].rate = rateValue;
  }
  multiRateChange(formIndex: number, rate: number, option: string): void {
    const multiOption = { [option]: rate };
    let multiRate = [];

    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const ratingControl = formGroup.controls.multi_option_rating as FormControl;
    multiRate = ratingControl.value || [];

    if (multiRate.length > 0) {
      multiRate.forEach((rateOption) => {
        rateOption[option] = rate;
      });
    } else {
      multiRate.push(multiOption);
    }
    ratingControl.setValue([...multiRate]);
  }

  optionRateChange(rateValue: number, formIndex: number): void {
    const formGroup: FormGroup = this.questionsFormControl.controls[formIndex] as FormGroup;
    const ratingControl = formGroup.controls.option_rating as FormControl;
    ratingControl.setValue(rateValue);
  }
}
