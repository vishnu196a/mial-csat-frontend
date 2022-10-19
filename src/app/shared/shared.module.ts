import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxPermissionsModule } from 'ngx-permissions';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchComponent } from './components/search/search.component';
import { EmergencyCallComponent } from './components/tag-call-component/emergency-call/emergency-call.component';
import { FeedbackCallComponent } from './components/tag-call-component/feedback-call/feedback-call.component';
import { RequestCallComponent } from './components/tag-call-component/request-call/request-call.component';
import { TagCallComponent } from './components/tag-call-component/tag-call/tag-call.component';
import { GridModule } from './modules/grid.module';
import { TruncatePipe } from './pipes/truncate.pipe';
import { BusinessEnquiryComponent } from './components/tag-call-component/business-enquiry/business-enquiry.component';

@NgModule({
  declarations: [
    LoadingButtonComponent,
    PaginationComponent,
    SearchComponent,
    TagCallComponent,
    EmergencyCallComponent,
    TruncatePipe,
    FeedbackCallComponent,
    RequestCallComponent,
    BusinessEnquiryComponent,
  ],
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
    PaginationComponent,
    SearchComponent,
    NgxPermissionsModule,
    NgSelectModule,
    DigitOnlyModule,
    AngularEditorModule,
    FormsModule,
  ],
})
export class SharedModule {}
