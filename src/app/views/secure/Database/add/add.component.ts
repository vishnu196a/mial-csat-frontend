import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EDITER_CONFIG } from '@shared/constants/constants';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AddContent, NameAndId } from '../cms.model';
import { CmsService } from '../cms.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddContentComponent implements OnInit, OnDestroy {
  addContentForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  categories: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  role: Role;
  private subscriptions = new Subscription();
  editorConfig: AngularEditorConfig = EDITER_CONFIG;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private contentService: CmsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.modifyFormBasedOnRole();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.addContentForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addContentForm.controls;
  }

  private modifyFormBasedOnRole(): void {
    if (this.role) {
      const roleFromControl = this.formControls.role;
      roleFromControl.setValue(this.role);
      roleFromControl.disable();
      roleFromControl.updateValueAndValidity();
    }
  }

  onFormSubmit(): void {
    if (this.addContentForm.valid) {
      this.isLoading = true;
      const content: AddContent = {
        title: this.addContentForm.value.title,
        content: this.addContentForm.value.content,
      };
      const observer = this.contentService.addContent(content).subscribe(
        () => {
          this.toasterService.success('Content added successfully');
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
