import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalInfoRoutingModule } from './terminal-info-routing.module';
import { ListComponent } from './list/list.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [ListComponent, AddComponent, EditComponent],
  imports: [CommonModule, TerminalInfoRoutingModule, SharedModule, GridModule],
})
export class TerminalInfoModule {}
