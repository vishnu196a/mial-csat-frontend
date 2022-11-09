import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, GridModule, NgbModule],
})
export class SurveyListModule {}
