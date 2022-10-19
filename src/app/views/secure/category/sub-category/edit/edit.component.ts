import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SubCategory, SubCategoryResponse } from '../sub-category.model';
import { SubCategoryService } from '../sub-category.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditSubCategoryComponent implements OnInit, OnDestroy {
  editSubCategoryForm: FormGroup;
  isLoading: boolean = false;
  hasValidationError: boolean;
  validationErrors: string[];
  hasCategory: boolean = false;
  initialLoading = true;
  private categoryId: number;
  private subCategoryId: number;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private subCategoryService: SubCategoryService,
    private formState: FormStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.categoryId = parseInt(this.route.snapshot.url[0].path, 10);
    this.subCategoryId = this.route.snapshot.params.id;
    this.getSubCategoryAndInitializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editSubCategoryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }

  private getSubCategoryAndInitializeForm(): void {
    const observer = this.subCategoryService
      .getSubCategoryDetails(this.categoryId, this.subCategoryId)
      .subscribe(
        (subCategory: SubCategoryResponse) => {
          this.editSubCategoryForm.patchValue({
            name: subCategory.name,
          });
          this.hasCategory = true;
          this.initialLoading = false;
          this.formState.isFormPristine(this.editSubCategoryForm);
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.hasCategory = false;
          this.initialLoading = false;
        }
      );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editSubCategoryForm.controls;
  }

  onFormUpdate(): void {
    if (this.editSubCategoryForm.valid) {
      this.isLoading = true;
      const category: SubCategory = {
        name: this.editSubCategoryForm.value.name,
      };
      const observer = this.subCategoryService
        .updateSubCategory(category, this.categoryId, this.subCategoryId)
        .subscribe(
          () => {
            this.toasterService.success('Sub category has been updated successfully');
            this.router.navigate(['/categories', this.categoryId]);
          },
          (error: ErrorResponse) => {
            if (error.hasValidationError) {
              this.hasValidationError = true;
              this.validationErrors = error.errorList;
            } else {
              this.hasValidationError = false;
              window.scrollTo({ top: 0 });
              this.toasterService.error(error.message);
            }
            this.isLoading = false;
          }
        );
      this.subscriptions.add(observer);
    }
  }
}
