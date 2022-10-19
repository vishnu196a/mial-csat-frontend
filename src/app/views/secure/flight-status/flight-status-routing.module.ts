import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightStatusDetailComponent } from './detail/detail.component';
import { FlightStatusListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: FlightStatusListComponent },
  { path: ':id', component: FlightStatusDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightStatusRoutingModule {}
