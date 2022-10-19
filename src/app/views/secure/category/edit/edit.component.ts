import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Category } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  editCategoryForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  hasCategory: boolean;
  initialLoading = true;
  private categoryId: number;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private categoryService: CategoryService,
    private formState: FormStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.categoryId = this.route.snapshot.params.id;
    this.getCategoryAndInitializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editCategoryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }

  private getCategoryAndInitializeForm(): void {
    const observer = this.categoryService.getCategoryDetails(this.categoryId).subscribe(
      (category: Category) => {
        this.editCategoryForm.patchValue({
          name: category.name,
        });
        this.hasCategory = true;
        this.initialLoading = false;
        this.formState.isFormPristine(this.editCategoryForm);
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
    return this.editCategoryForm.controls;
  }

  onFormUpdate(): void {
    if (this.editCategoryForm.valid) {
      this.isLoading = true;
      const category: Category = {
        name: this.editCategoryForm.value.name,
      };
      const observer = this.categoryService.updateCategory(category, this.categoryId).subscribe(
        () => {
          this.toasterService.success('Category has been updated successfully');
          this.router.navigate(['categories']);
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
