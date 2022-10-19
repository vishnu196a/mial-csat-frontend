import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallTagsRoutingModule } from './call-tags-routing.module';
import { CallTagsComponent } from './list/list.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [CallTagsComponent, ViewComponent],
  imports: [CommonModule, CallTagsRoutingModule, SharedModule, GridModule],
})
export class CallTagsModule {}
