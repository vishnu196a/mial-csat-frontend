import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFooterModule } from '@coreui/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyFormComponent } from '@public/survey-form/survey-form.component';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationRoutingModule } from './authentication.routing';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [CommonModule, AuthenticationRoutingModule, AppFooterModule, SharedModule, NgbModule],
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SurveyFormComponent,
  ],
})
export class AuthenticationModule {}
