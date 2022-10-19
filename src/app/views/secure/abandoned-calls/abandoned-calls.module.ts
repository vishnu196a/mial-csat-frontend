import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { AbandonedCallsRoutingModule } from './abandoned-calls-routing.module';
import { CallbackListComponent } from './callback-list/callback-list.component';
import { CalledbackListComponent } from './calledback-list/calledback-list.component';
import { AbandonedCallsListComponent } from './list/list.component';

@NgModule({
  declarations: [AbandonedCallsListComponent, CallbackListComponent, CalledbackListComponent],
  imports: [CommonModule, AbandonedCallsRoutingModule, SharedModule, GridModule],
})
export class AbandonedCallsModule {}
