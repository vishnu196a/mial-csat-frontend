import { Component } from '@angular/core';

@Component({
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
  currentYear: number = new Date().getFullYear();
}
