import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryReportsListRoutingModule } from './category-reports-list-routing.module';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { CategoryReportsListComponent } from './list/list.component';
import { SubCategoryReportsListComponent } from './sub-category-reports-list/list/list.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [CategoryReportsListComponent, SubCategoryReportsListComponent],
  imports: [CommonModule, CategoryReportsListRoutingModule, SharedModule, GridModule, ChartsModule],
})
export class CategoryReportsListModule {}
