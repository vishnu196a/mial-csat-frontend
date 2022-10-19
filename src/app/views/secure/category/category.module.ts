import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { AddCategoryComponent } from './add/add.component';
import { EditCategoryComponent } from './edit/edit.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { CategoryListComponent } from './list/list.component';
import { AddSubCategoryComponent } from './sub-category/add/add.component';
import { EditSubCategoryComponent } from './sub-category/edit/edit.component';
import { SubCategoryListComponent } from './sub-category/list/list.component';

@NgModule({
  declarations: [
    AddCategoryComponent,
    EditCategoryComponent,
    CategoryListComponent,
    AddSubCategoryComponent,
    EditSubCategoryComponent,
    SubCategoryListComponent,
  ],
  imports: [CommonModule, CategoryRoutingModule, SharedModule, GridModule],
})
export class CategoryModule {}
