import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RolesList, UserForm, UserResponse } from '../user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditUserComponent implements OnInit, OnDestroy {
  editUserForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  hasUser: boolean;
  initialLoading = true;
  private userId: number;
  private subscriptions = new Subscription();
  private currentUser: UserResponse;
  rolesList: RolesList[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private userService: UserService,
    private formState: FormStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userId = this.route.snapshot.params.id;
    this.getRolesList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editUserForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      role: [null, Validators.required],
      emp_no: [null, Validators.required],
      agent_code: [null, Validators.required],
      mobile_no: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(REGEX_PATTERNS.mobile),
        ],
      ],
      email: [null, [Validators.required, Validators.pattern(REGEX_PATTERNS.email)]],
    });
  }
  private getRolesList(): void {
    this.isLoading = true;
    const observer = this.userService.getRoles().subscribe(
      (roles: RolesList[]) => {
        this.rolesList = roles;
        this.isLoading = false;
        this.getUserAndInitializeForm();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  private getUserAndInitializeForm(): void {
    const observer = this.userService.getUserDetails(this.userId).subscribe(
      (user: UserResponse) => {
        this.editUserForm.patchValue({
          name: user.name,
          role: user.role_id,
          mobile_no: user.mobile_no,
          email: user.email,
          agent_code: user.agent_code,
          emp_no: user.employee_number,
        });
        this.currentUser = user;
        this.hasUser = true;
        this.initialLoading = false;
        this.formState.isFormPristine(this.editUserForm);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasUser = false;
        this.initialLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editUserForm.controls;
  }

  onFormUpdate(): void {
    if (this.editUserForm.valid) {
      this.isLoading = true;
      const user: UserForm = {
        name: this.editUserForm.value.name,
        role_id: this.editUserForm.value.role,
        mobile_no: this.editUserForm.value.mobile_no,
        email: this.currentUser.email,
        employee_number: this.editUserForm.value.emp_no,
        agent_code: this.editUserForm.value.agent_code,
      };
      const observer = this.userService.updateUser(user, this.userId).subscribe(
        () => {
          this.toasterService.success('User has been updated successfully');
          this.router.navigate(['users']);
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
