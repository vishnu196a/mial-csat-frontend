import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isShowPassword = false;
  isLoading = false;
  logInForm: FormGroup;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toasterService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(REGEX_PATTERNS.email)]],
      password: ['', Validators.required],
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  changeInputType(): void {
    this.isShowPassword = !this.isShowPassword;
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.logInForm.controls;
  }

  onLogIn(): void {
    if (this.logInForm.valid) {
      this.isLoading = true;
      this.authService.login(this.logInForm.value).subscribe(
        () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.isLoading = false;
        }
      );
    }
  }
}
