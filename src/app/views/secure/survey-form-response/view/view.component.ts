import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyResponseView } from '@secure/survey-form/survey-list.model';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SurveyFormResponseService } from '../survey-form-response.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, OnDestroy {
  formId: number;
  isLoading: boolean = false;
  hasDetails: boolean = false;
  surveyResponse: SurveyResponseView;
  question: string;
  answer: string;
  private subscriptions = new Subscription();

  constructor(
    private surveyResponseService: SurveyFormResponseService,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.params.id;
    this.getResponseFormData();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getResponseFormData(): void {
    this.isLoading = true;
    const observer = this.surveyResponseService.getSurveyFormDetails(this.formId).subscribe(
      (surveyResponse: SurveyResponseView) => {
        this.surveyResponse = surveyResponse;
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
}
