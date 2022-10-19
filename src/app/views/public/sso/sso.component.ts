import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@public/authentication/authentication.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './sso.component.html',
})
export class SsoComponent implements OnInit, OnDestroy {
  invitationToken: string;
  subscriptions = new Subscription();

  constructor(
    public toasterService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invitationToken = this.activatedRoute.snapshot.queryParams['token'];
    this.getSsoResponse();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getSsoResponse(): void {
    const observer = this.authService.loginFromIvr(this.invitationToken).subscribe(
      () => {
        this.router.navigateByUrl('/');
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
}
