import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryReportsListComponent } from './list/list.component';
import { SubCategoryReportsListComponent } from './sub-category-reports-list/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryReportsListComponent,
  },
  {
    path: ':id',
    component: SubCategoryReportsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryReportsListRoutingModule {}
