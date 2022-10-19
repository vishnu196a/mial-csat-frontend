import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SignOut } from '@public/authentication/store/authentication.action';
import { Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const errorResponse: ErrorResponse = {
          errorList: null,
          hasValidationError: false,
          message: null,
          status: null,
        };
        errorResponse.status = httpErrorResponse.status;
        const errorMessages = httpErrorResponse.error.errors
          ? httpErrorResponse.error.errors
          : [httpErrorResponse.error.error];
        if (httpErrorResponse.status <= 0) {
          errorResponse.message = 'Sorry, no Internet connectivity, Please reconnect and try again';
        } else if (httpErrorResponse.status === 400) {
          errorResponse.message = 'Bad request';
        } else if (httpErrorResponse.status === 401) {
          this.store.dispatch(new SignOut());
          this.router.navigate(['/login']);
          errorResponse.message =
            errorMessages[0] ||
            'Sorry for the inconvenience, but you are not authorized to look into this page';
        } else if (httpErrorResponse.status === 403) {
          errorResponse.message = errorMessages[0] || 'Forbidden';
        } else if (httpErrorResponse.status === 404) {
          errorResponse.message = errorMessages[0] || 'Not found';
        } else if (httpErrorResponse.status === 422) {
          errorResponse.hasValidationError = true;
          errorResponse.errorList = errorMessages;
          errorResponse.message = 'Validation error';
        } else if (httpErrorResponse.status === 500) {
          errorResponse.message = errorMessages[0] || 'Internal server error';
        } else {
          errorResponse.message = errorMessages[0] || 'Something went wrong. Please contact admin';
        }
        return throwError(errorResponse);
      })
    );
  }
}
