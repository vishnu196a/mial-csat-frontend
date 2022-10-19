import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EventEmitter } from '@angular/core';
import { DeleteModelContent } from '@shared/models/shared.model';

@Component({
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
  public delete = new EventEmitter<boolean>();
  public deleteModelContent: DeleteModelContent;

  constructor(public bsModalRef: BsModalRef) {}

  onDelete(): void {
    this.delete.emit(true);
    this.bsModalRef.hide();
  }
}
