import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { Subscription } from 'rxjs';
import { CardState, CardStates } from './forgot-password.model';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { ForgotPwdRequestParams } from '../authentication.model';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [
    trigger('cardFlip', [
      state(
        CardStates.DEFAULT,
        style({
          transform: 'none',
        })
      ),
      state(
        CardStates.FLIPPED,
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      transition(`${CardStates.DEFAULT} <=> ${CardStates.FLIPPED}`, animate(400)),
    ]),
  ],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  isPasswordResetLinkSend = false;
  data: CardState = {
    state: CardStates.DEFAULT,
  };
  forgotPasswordForm: FormGroup;
  lastUsedEmailId: string;
  subscriptions = new Subscription();
  isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public toasterService: ToastrService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(REGEX_PATTERNS.email)]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get email(): AbstractControl {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const params: ForgotPwdRequestParams = {
        email: this.email.value,
      };
      const observer = this.authService.forgotPassword(params).subscribe(
        () => {
          this.isPasswordResetLinkSend = true;
          this.lastUsedEmailId = this.email.value;
          this.data.state = CardStates.FLIPPED;
          this.isLoading = false;
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.isLoading = false;
          this.isPasswordResetLinkSend = false;
          this.data.state = CardStates.DEFAULT;
        }
      );
      this.subscriptions.add(observer);
    }
  }

  toggleCard(): void {
    this.isPasswordResetLinkSend = false;
    this.data.state = CardStates.DEFAULT;
  }
}
