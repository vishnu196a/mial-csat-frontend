import { Component } from '@angular/core';
import { PERMISSION_LIST } from '@shared/constants/constants';
import { AgGridContext } from '@shared/models/shared.model';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface CustomButton {
  btnClass: string;
  btnTitle: string;
  iconClass: string;
}

@Component({
  templateUrl: './ag-grid-actions.component.html',
})
export class AgGridActionsComponent implements AgRendererComponent {
  params: ICellRendererParams;
  context: AgGridContext;
  hasInvite: boolean;
  hasDetails: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  hasDisable: boolean;
  hasResend: boolean;
  hasReport: boolean;
  hasUpdateCall: boolean;
  hasDownload: boolean;
  hasTag: boolean;
  canView: string;
  canEdit: string;
  canDelete: string;
  canTagCall: string;
  canDisable: string;
  canResend: string;
  customButton: CustomButton;
  permissionList: typeof PERMISSION_LIST;

  agInit(params: ICellRendererParams): void {
    this.context = params.context;
    this.hasInvite = this.context.hasInvite;
    this.hasDetails = this.context.hasDetails;
    this.hasTag = this.context.hasTag;
    this.hasDisable = this.context.hasDisable;
    this.hasEdit = this.context.hasEdit;
    this.hasResend = this.context.hasResend;
    this.hasReport = this.context.hasReport;
    this.hasUpdateCall = this.context.hasUpdateCall;
    this.hasDownload = this.context.hasDownload;
    this.canView = this.context.canView;
    this.canEdit = this.context.canEdit;
    this.canDelete = this.context.canDelete;
    this.canDisable = this.context.canDisable;
    this.customButton = this.context.customButton;
    this.canTagCall = this.context.canTagCall;
    this.canResend = this.context.canResend;
    this.params = params;
    this.hasDelete = this.context.hasDelete;
  }

  refresh(): boolean {
    return false;
  }

  onInvite(): void {
    this.context.componentParent.invite.emit(this.params);
  }

  onView(): void {
    this.context.componentParent.view.emit(this.params);
  }

  onEdit(): void {
    this.context.componentParent.editRow.emit(this.params);
  }

  onDelete(): void {
    this.context.componentParent.onDelete(this.params);
  }

  onTagCall(): void {
    this.context.componentParent.callTag.emit(this.params);
  }

  onCustomButtonClick(): void {
    this.context.componentParent.customButtonClick.emit(this.params);
  }
  onDisable(): void {
    this.context.componentParent.disable.emit(this.params);
  }
  onResend(): void {
    this.context.componentParent.resend.emit(this.params);
  }
  onReport(): void {
    this.context.componentParent.report.emit(this.params);
  }
  onUpdateCall(): void {
    this.context.componentParent.updateCall.emit(this.params);
  }
  onDownload(): void {
    this.context.componentParent.download.emit(this.params);
  }
}
