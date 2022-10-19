import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { confirmPasswordMismatchValidator } from '@shared/validators/change-password.validator';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ResetPwdRequestParams } from '../authentication.model';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  isShowPassword = false;
  isShowConfirmPassword = false;
  resetPwdForm: FormGroup;
  passwordToken: string;
  subscriptions = new Subscription();
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passwordToken = this.activatedRoute.snapshot.queryParams['reset_token'];
    this.resetPwdForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: confirmPasswordMismatchValidator('password', 'confirmPassword'),
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changePasswordInput(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  changeConfirmPasswordInput(): void {
    this.isShowConfirmPassword = !this.isShowConfirmPassword;
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.resetPwdForm.controls;
  }

  onResetPwd(): void {
    if (this.resetPwdForm.valid) {
      this.isLoading = true;
      const params: ResetPwdRequestParams = {
        password: this.resetPwdForm.value.password,
        password_confirmation: this.resetPwdForm.value.confirmPassword,
      };
      const observer = this.authService.resetPassword(params, this.passwordToken).subscribe(
        () => {
          this.router.navigateByUrl('/login');
          this.isLoading = false;
          this.toasterService.success('You have successfully reset your password');
        },
        (error: ErrorResponse) => {
          this.isLoading = false;
          if (error.hasValidationError) {
            this.hasValidationError = true;
            this.validationErrors = error.errorList;
            window.scrollTo({ top: 0 });
          } else {
            this.hasValidationError = false;
            this.toasterService.error(error.message);
          }
        }
      );
      this.subscriptions.add(observer);
    }
  }
}
