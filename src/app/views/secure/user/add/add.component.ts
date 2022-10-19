import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX_PATTERNS, USER_ROLES } from '@shared/constants/constants';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RolesList, UserForm } from '../user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddUserComponent implements OnInit, OnDestroy {
  addUserForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  rolesList: RolesList[];
  readonly roles = USER_ROLES;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.modifyFormBasedOnRole();
    this.getRolesList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addUserForm = this.formBuilder.group({
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

  get formControls(): { [key: string]: AbstractControl } {
    return this.addUserForm.controls;
  }

  private getRolesList(): void {
    this.isLoading = true;
    const observer = this.userService.getRoles().subscribe(
      (roles: RolesList[]) => {
        this.rolesList = roles;
        this.isLoading = false;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
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
    if (this.addUserForm.valid) {
      this.isLoading = true;
      const user: UserForm = {
        name: this.addUserForm.value.name,
        role_id: this.role ? this.role : this.addUserForm.value.role,
        mobile_no: this.addUserForm.value.mobile_no,
        email: this.addUserForm.value.email,
        employee_number: this.addUserForm.value.emp_no,
        agent_code: this.addUserForm.value.agent_code,
      };
      const observer = this.userService.addUser(user).subscribe(
        () => {
          this.toasterService.success('User added successfully');
          this.router.navigate(['users']);
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
