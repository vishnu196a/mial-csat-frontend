import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { AddContentComponent } from './add/add.component';
import { CMSRoutingModule } from './cms-routing.module';
import { CmsListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';
import { HelpSosComponent } from './help-sos/help-sos.component';
import { AddSOSComponent } from './help-sos/add/add.component';
import { EditSosComponent } from './help-sos/edit/edit.component';

@NgModule({
  declarations: [
    CmsListComponent,
    AddContentComponent,
    ViewComponent,
    EditComponent,
    HelpSosComponent,
    AddSOSComponent,
    EditSosComponent,
  ],
  imports: [CommonModule, CMSRoutingModule, SharedModule, GridModule],
})
export class CMSModule {}
