import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { FlightStatusDetailComponent } from './detail/detail.component';
import { FlightStatusRoutingModule } from './flight-status-routing.module';
import { FlightStatusListComponent } from './list/list.component';

@NgModule({
  declarations: [FlightStatusListComponent, FlightStatusDetailComponent],
  imports: [CommonModule, FlightStatusRoutingModule, SharedModule, GridModule],
})
export class FlightStatusModule {}
