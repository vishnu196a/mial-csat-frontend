import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserDetail } from '@public/authentication/authentication.model';
import { getUserDetails } from '@public/authentication/store/authentication.selector';
import { PERMISSION_LIST } from '@shared/constants/constants';
import { chain, head, startCase } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  permissionList: typeof PERMISSION_LIST;
  user: UserDetail;
  userInitials: string;
  userName: string;
  subscription = new Subscription();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store.select(getUserDetails).subscribe((user: UserDetail) => {
      this.user = user;
      this.userName = startCase(user.name);
      this.userInitials = chain(this.userName).split(' ').slice(0, 2).map(head).join('').value();
    });
    this.subscription.add(observer);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
