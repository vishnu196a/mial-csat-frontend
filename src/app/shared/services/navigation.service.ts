import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];

  constructor(private router: Router) {}

  public startSaveHistory(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  public goBack(): void {
    const urlToBack = this.history[this.history.length - 2];
    if (urlToBack) {
      this.router.navigateByUrl(urlToBack);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
