import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { GridModule } from './modules/grid.module';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [LoadingButtonComponent, TruncatePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    DigitOnlyModule,
    GridModule,
  ],
  exports: [
    ReactiveFormsModule,
    LoadingButtonComponent,
    NgxPermissionsModule,
    NgSelectModule,
    DigitOnlyModule,
    AngularEditorModule,
    FormsModule,
  ],
})
export class SharedModule {}
