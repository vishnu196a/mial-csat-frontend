import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EDITER_CONFIG_VIEW } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CmsView } from '../cms.model';
import { CmsService } from '../cms.service';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit, OnDestroy {
  viewContentForm: FormGroup;
  isLoading: boolean;
  private subscriptions = new Subscription();
  editorConfig: AngularEditorConfig = EDITER_CONFIG_VIEW;
  content: CmsView;
  contentId: number;
  contentText: string;

  constructor(
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private contentService: CmsService
  ) {}

  ngOnInit(): void {
    this.contentId = this.route.snapshot.params.id;
    this.getContent();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  private getContent(): void {
    const observer = this.contentService.getContent(this.contentId).subscribe(
      (content: CmsView) => {
        this.content = content;
        this.contentText = content.content;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
}
