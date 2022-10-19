import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { GridModule } from './grid.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, GridModule, SharedModule],
  exports: [],
})
export class DetailsGridModule {}
