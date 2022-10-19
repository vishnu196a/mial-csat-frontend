import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
})
export class LoadingButtonComponent {
  @Input() disabled: boolean = false;
  @Input() buttonClass: string = 'btn-primary';
  @Input() buttonText: string;
  @Input() buttonIconClass: string;
  @Input() isLoading: boolean = false;
  @Input() loadingText: string;
  @Input() hideTextOnSM: string;
  @Input() title: string;
  @Output() buttonClick = new EventEmitter();

  click(): void {
    this.buttonClick.emit();
  }
}
