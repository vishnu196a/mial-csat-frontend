import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyInvitationListRoutingModule } from './survey-invitation-list-routing.module';
import { SurveyInvitationListComponent } from './list/list.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [SurveyInvitationListComponent],
  imports: [CommonModule, SurveyInvitationListRoutingModule, SharedModule, GridModule],
})
export class SurveyInvitationListModule {}
