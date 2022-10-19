import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SosForm } from '@secure/Database/cms.model';
import { CmsService } from '@secure/Database/cms.service';
import { USER_ROLES } from '@shared/constants/constants';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './add.component.html',
})
export class AddSOSComponent implements OnInit, OnDestroy {
  addSosForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  readonly roles = USER_ROLES;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addSosForm = this.formBuilder.group({
      Helplinetype: ['HelpPhone', [Validators.required]],
      extension: [null, [Validators.required]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addSosForm.controls;
  }

  onFormSubmit(): void {
    if (this.addSosForm.valid) {
      this.isLoading = true;
      const sosForm: SosForm = {
        type: this.addSosForm.value.Helplinetype,
        extension: this.addSosForm.value.extension,
      };
      const observer = this.cmsService.addSosHelpDesk(sosForm).subscribe(
        () => {
          this.toasterService.success('SOS Helpline Number added successfully');
          this.router.navigate(['database/helpSOS']);
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
