import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SubCategory } from '../sub-category.model';
import { SubCategoryService } from '../sub-category.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddSubCategoryComponent implements OnInit, OnDestroy {
  addSubCategoryForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  private subscriptions = new Subscription();
  private CategoryId: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private subCategoryService: SubCategoryService
  ) {}

  ngOnInit(): void {
    this.CategoryId = this.route.snapshot.params.id;
    this.initializeForm();
    this.modifyFormBasedOnRole();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addSubCategoryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addSubCategoryForm.controls;
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
    if (this.addSubCategoryForm.valid) {
      this.isLoading = true;
      const subCategory: SubCategory = {
        name: this.addSubCategoryForm.value.name,
      };
      const observer = this.subCategoryService
        .addSubCategory(subCategory, this.CategoryId)
        .subscribe(
          () => {
            this.toasterService.success('Sub category added successfully');
            this.router.navigate(['/categories', this.CategoryId]);
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
