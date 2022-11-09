import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreModule } from '@ngrx/store';
import { AuthenticationGuard } from '@shared/guards/authentication.guard';
import { ErrorInterceptor } from '@shared/interceptor/error.interceptor';
import { TokenInterceptor } from '@shared/interceptor/token.interceptor';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { metaReducers } from './app.meta-reducer';
import { appReducers } from './app.reducer';
import { AppRoutingModule } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    IconModule,
    IconSetModule.forRoot(),
    StoreModule.forRoot(appReducers, { metaReducers: metaReducers }),
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
    }),
    NgxPermissionsModule.forRoot(),
    HttpClientModule,
    NgSelectModule,
    AngularEditorModule,
    ChartsModule,
  ],
  declarations: [AppComponent],
  providers: [
    AuthenticationGuard,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    IconSetService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
