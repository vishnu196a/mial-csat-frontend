import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {
  selected: string = 'dynamic';
  constructor() {}

  ngOnInit(): void {}
}
