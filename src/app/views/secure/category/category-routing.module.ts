import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './add/add.component';
import { EditCategoryComponent } from './edit/edit.component';
import { CategoryListComponent } from './list/list.component';
import { AddSubCategoryComponent } from './sub-category/add/add.component';
import { EditSubCategoryComponent } from './sub-category/edit/edit.component';
import { SubCategoryListComponent } from './sub-category/list/list.component';

const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: 'new', component: AddCategoryComponent },
  { path: ':id/edit', component: EditCategoryComponent },
  { path: ':id', component: SubCategoryListComponent },
  { path: ':id/sub-categories/new', component: AddSubCategoryComponent },
  { path: ':id/sub-categories/:id/edit', component: EditSubCategoryComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
