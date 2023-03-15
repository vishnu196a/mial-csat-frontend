import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { freeSet } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public iconSet: IconSetService) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
