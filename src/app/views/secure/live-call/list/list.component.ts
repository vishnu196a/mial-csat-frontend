import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LiveCallList } from '../live-call.model';
import { LiveCallService } from '../live-call.service';
import { LiveCallColumnDefs } from './live-call.columns';

@Component({
  templateUrl: './list.component.html',
})
export class LiveCallListComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  liveCalls: LiveCallList[] = [];
  permissionList: typeof PERMISSION_LIST;
  viewOrTag: boolean = false;
  callWaitingCount: number;
  callAbandonedCount: number;
  callAttendedCount: number;
  showRed: boolean = false;
  rowStyle = { background: 'lightgreen' };
  constructor(
    private liveCallService: LiveCallService,
    private rolebasedPermissions: RolebasedPermissionService,
    private toasterService: ToastrService,
    private router: Router,
    private shared: SharedService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    this.initializeColumn();
  }
  initializeColumn(): void {
    this.columnDefs = [
      {
        headerName: 'S.No',
        width: S_NO_WIDTH,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + 1,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(LiveCallColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No calls to show.',
    };
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.getLiveCall();
  }

  getLiveCall(): void {
    const observer = this.liveCallService.getLiveCallList().subscribe(
      (liveCalls: LiveCallList[]) => {
        if (liveCalls.length > 0) {
          this.callWaitingCount = liveCalls[0].total_call_waiting_count || 0;
          this.callAbandonedCount = liveCalls[0].total_abandoned_calls || 0;
          this.callAttendedCount = liveCalls[0].total_calls_attended || 0;
          if (liveCalls[0]['id']) {
            this.viewOrTag = liveCalls[0]?.already_tagged;
            this.showRed = parseInt(liveCalls[0].call_duration_in_minutes, 10) > 2;
            this.rowStyle.background = this.showRed ? 'red' : 'lightgreen';
            liveCalls.forEach((calls) => {
              calls.datetime_init = this.shared.getIstFormattedDate(calls.datetime_init);
            });
            this.liveCalls = liveCalls;
          }
        }
        setTimeout(() => this.getLiveCall(), 5000);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onTagCall(params: ICellRendererParams): void {
    const callId = params.data.call_entry_id;
    localStorage.setItem('CallFrom', 'B');
    this.router.navigate(['/live_call', callId, 'tag']);
  }
  onView(params: ICellRendererParams): void {
    this.router.navigate(['/call_tags', params.data.call_tag_id]);
  }
}
