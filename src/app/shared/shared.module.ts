import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [LoadingButtonComponent, TruncatePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    DigitOnlyModule,
  ],
  exports: [
    ReactiveFormsModule,
    LoadingButtonComponent,
    NgSelectModule,
    DigitOnlyModule,
    AngularEditorModule,
    FormsModule,
  ],
})
export class SharedModule {}
