import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { LiveCallListComponent } from './list/list.component';
import { CallEntryRoutingModule } from './live-call-routing.module';
import { UntaggedCallsComponent } from './untagged-calls/untagged-calls.component';
import { AddManualCallTagComponent } from './add/add.component';

@NgModule({
  declarations: [LiveCallListComponent, UntaggedCallsComponent, AddManualCallTagComponent],
  imports: [CommonModule, CallEntryRoutingModule, SharedModule, GridModule],
})
export class CallEntryModule {}
