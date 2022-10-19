import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CallTagDetails } from '../call-tags.model';
import { CallTagsService } from '../call-tags.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, OnDestroy {
  callTagId: number;
  isLoading: boolean = false;
  hasDetails: boolean = false;
  callTagDetails: CallTagDetails;
  question: string;
  answer: string;
  mobileNumber: string;
  private subscriptions = new Subscription();

  constructor(
    private callTagsService: CallTagsService,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.callTagId = this.route.snapshot.params.id;
    this.getCallTagDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getCallTagDetails(): void {
    this.isLoading = true;
    const observer = this.callTagsService.getCallTagDetails(this.callTagId).subscribe(
      (callTagDetails: CallTagDetails) => {
        this.callTagDetails = callTagDetails;
        this.question = callTagDetails.question;
        this.answer = callTagDetails.answer;
        this.mobileNumber = callTagDetails.contact_number;
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
