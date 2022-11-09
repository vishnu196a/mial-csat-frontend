import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppFooterModule } from '@coreui/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SurveyFormComponent } from '@public/survey-form/survey-form.component';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationRoutingModule } from './authentication.routing';

@NgModule({
  imports: [CommonModule, AuthenticationRoutingModule, AppFooterModule, SharedModule, NgbModule],
  declarations: [SurveyFormComponent],
})
export class AuthenticationModule {}
