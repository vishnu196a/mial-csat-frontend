import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EDITER_CONFIG } from '@shared/constants/constants';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AddContent, CmsView, NameAndId } from '../cms.model';
import { CmsService } from '../cms.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy {
  editContentForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  categories: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  role: Role;
  private subscriptions = new Subscription();
  editorConfig: AngularEditorConfig = EDITER_CONFIG;
  contentId: number;
  content: CmsView;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private contentService: CmsService
  ) {}

  ngOnInit(): void {
    this.contentId = this.route.snapshot.params.id;
    this.initializeForm();
    this.modifyFormBasedOnRole();
    this.getContentDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  private initializeForm(): void {
    this.editContentForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editContentForm.controls;
  }

  private modifyFormBasedOnRole(): void {
    if (this.role) {
      const roleFromControl = this.formControls.role;
      roleFromControl.setValue(this.role);
      roleFromControl.disable();
      roleFromControl.updateValueAndValidity();
    }
  }

  getContentDetails(): void {
    const observer = this.contentService.getContent(this.contentId).subscribe(
      (content: CmsView) => {
        this.content = content;
        this.isLoading = false;
        this.editContentForm.patchValue({
          title: this.content.title,
          content: this.content.content,
        });
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  onFormSubmit(): void {
    if (this.editContentForm.valid) {
      this.isLoading = true;
      const content: AddContent = {
        title: this.editContentForm.value.title,
        content: this.editContentForm.value.content,
      };
      const observer = this.contentService.updateContent(this.contentId, content).subscribe(
        () => {
          this.toasterService.success('Database updated successfully');
          this.router.navigate(['/database']);
        },
        (error: ErrorResponse) => {
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
  }
}
