import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationService } from '@public/authentication/authentication.service';
import { ProfileService } from '@secure/profile/profile.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { SignOut } from '@public/authentication/store/authentication.action';
import {
  changePasswordMismatchValidator,
  confirmPasswordMismatchValidator,
} from '@shared/validators/change-password.validator';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ChangePwdRequestParams } from '../profile.model';

@Component({
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePwdForm: FormGroup;
  isShowCurrentPassword = false;
  isShowNewPassword = false;
  isShowConfirmPassword = false;
  subscriptions = new Subscription();
  isLoading: boolean = false;
  hasValidationError: boolean = false;
  validationErrors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private authService: AuthenticationService,
    private store: Store,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.changePwdForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          confirmPasswordMismatchValidator('newPassword', 'confirmPassword'),
          changePasswordMismatchValidator('currentPassword', 'newPassword'),
        ],
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  changeCurrentPasswordInput(): void {
    this.isShowCurrentPassword = !this.isShowCurrentPassword;
  }

  changeNewPasswordInput(): void {
    this.isShowNewPassword = !this.isShowNewPassword;
  }

  changeConfirmPasswordInput(): void {
    this.isShowConfirmPassword = !this.isShowConfirmPassword;
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.changePwdForm.controls;
  }

  onChangePwd(): void {
    if (this.changePwdForm.valid) {
      this.isLoading = true;
      this.hasValidationError = false;
      const params: ChangePwdRequestParams = {
        current_password: this.changePwdForm.value.currentPassword,
        password: this.changePwdForm.value.newPassword,
        password_confirmation: this.changePwdForm.value.confirmPassword,
      };
      const observer = this.profileService.changePassword(params).subscribe(
        () => {
          this.isLoading = false;
          this.toasterService.success(
            'Password has been changed successfully. Login with new credentials'
          );
          this.onLogOut();
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
  private onLogOut(): void {
    const observer = this.authService.logout().subscribe(
      () => {
        this.store.dispatch(new SignOut());
        this.router.navigate(['./login']);
      },
      () => {
        this.store.dispatch(new SignOut());
        this.router.navigate(['./login']);
      }
    );
    this.subscriptions.add(observer);
  }
}
