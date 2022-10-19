import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AG_GRID_DEFAULT_COLUMN_DEFS } from '@shared/constants/ag-grid.constants';
import {
  AgGridContext,
  DeleteModelContent,
  FloatingFilterSearchData,
} from '@shared/models/shared.model';
import { ColDef, ColumnState, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { AgGridActionsComponent, CustomButton } from '../ag-grid-actions/ag-grid-actions.component';
import { AgGridLoadingOverlayComponent } from '../ag-grid-loading-overlay/ag-grid-loading-overlay.component';
import { AgGridNoRowsOverlayComponent } from '../ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.component';
import { NoRowsOverlayComponentParams } from '../ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { AgGridDateTooltipComponent } from '../ag-grid-tooltip-date/ag-grid-tooltip-date.component';
import { DeleteComponent } from '../delete/delete.component';
import { FloatingFilterComponent } from '../floating-filter/floating-filter.component';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
})
export class AgGridComponent implements OnInit, OnDestroy {
  @Input() rowData: any[] | Observable<any[]>;
  @Input() getRowClass: string;
  @Input() columnDefs: ColDef[];
  @Input() defaultColumnDefs: ColDef;
  @Input() noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  @Input() deleteModelContent: DeleteModelContent;
  @Input() set hasDetails(hasDetails: boolean) {
    this._hasDetails = hasDetails;
    this.updateContext();
  }
  @Input() hasInvite: boolean = false;
  @Input() hasEdit: boolean = false;
  @Input() hasDelete: boolean = false;
  @Input() hasDisable: boolean = false;
  @Input() hasResend: boolean = false;
  @Input() hasReport: boolean = false;
  @Input() hasUpdateCall: boolean = false;
  @Input() hasDownload: boolean = false;
  @Input() helpDesk: boolean = false;

  @Input() set hasTag(hasTag: boolean) {
    this._hasTag = hasTag;
    this.updateContext();
  }
  @Input() canView: string;
  @Input() canEdit: string;
  @Input() canDelete: string;
  @Input() canDisable: string;
  @Input() canTagCall: string;
  @Input() canResend: string;
  @Input() stateName: string;
  @Input() rowStyle: string;

  @Input() customButtonOptions: CustomButton;
  @Output() gridReady = new EventEmitter<GridReadyEvent>();
  @Output() editRow = new EventEmitter<ICellRendererParams>();
  @Output() deleteRow = new EventEmitter<ICellRendererParams>();
  @Output() view = new EventEmitter<ICellRendererParams>();
  @Output() invite = new EventEmitter<ICellRendererParams>();
  @Output() callTag = new EventEmitter<ICellRendererParams>();
  @Output() disable = new EventEmitter<ICellRendererParams>();
  @Output() resend = new EventEmitter<ICellRendererParams>();
  @Output() floatingFilter = new EventEmitter<FloatingFilterSearchData>();
  @Output() customButtonClick = new EventEmitter<ICellRendererParams>();
  @Output() sortChanged = new EventEmitter<ColumnState[]>();
  @Output() report = new EventEmitter<ICellRendererParams>();
  @Output() updateCall = new EventEmitter<ICellRendererParams>();
  @Output() download = new EventEmitter<ICellRendererParams>();
  @Output() doubleClick = new EventEmitter<ICellRendererParams>();
  @Output() helpSOS = new EventEmitter<void>();

  private _hasTag: boolean;
  private _hasDetails: boolean;
  private agGrid: GridReadyEvent;
  loadingOverlayComponent: string;
  noRowsOverlayComponent: string;
  context: AgGridContext;
  defaultColDef: ColDef;
  frameworkComponents: {
    actionRenderer: typeof AgGridActionsComponent;
    noRowsOverlayComponent: typeof AgGridNoRowsOverlayComponent;
    loadingOverlayComponent: typeof AgGridLoadingOverlayComponent;
    floatingFilterComponent: typeof FloatingFilterComponent;
    dateTooltipComponent: typeof AgGridDateTooltipComponent;
  };
  bsModalRef: BsModalRef;
  private subscriptions = new Subscription();
  isAutoSize: boolean;
  // rowStyle = { background: 'red' };
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.updateContext();
    this.frameworkComponents = {
      actionRenderer: AgGridActionsComponent,
      noRowsOverlayComponent: AgGridNoRowsOverlayComponent,
      loadingOverlayComponent: AgGridLoadingOverlayComponent,
      floatingFilterComponent: FloatingFilterComponent,
      dateTooltipComponent: AgGridDateTooltipComponent,
    };
    this.loadingOverlayComponent = 'loadingOverlayComponent';
    this.noRowsOverlayComponent = 'noRowsOverlayComponent';
    this.defaultColDef = { ...AG_GRID_DEFAULT_COLUMN_DEFS, ...this.defaultColumnDefs };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateContext(): void {
    this.context = {
      componentParent: this,
      stateName: this.stateName,
      hasInvite: this.hasInvite,
      hasDetails: this._hasDetails,
      hasEdit: this.hasEdit,
      hasDelete: this.hasDelete,
      hasTag: this._hasTag,
      hasReport: this.hasReport,
      hasUpdateCall: this.hasUpdateCall,
      hasDownload: this.hasDownload,
      canView: this.canView,
      canEdit: this.canEdit,
      canDelete: this.canDelete,
      canTagCall: this.canTagCall,
      canDisable: this.canDisable,
      customButton: this.customButtonOptions,
      hasDisable: this.hasDisable,
      hasResend: this.hasResend,
      canResend: this.canResend,
    };
    if (this.agGrid) {
      this.agGrid.api.refreshCells();
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.agGrid = params;
    this.gridReady.emit(params);
  }
  onSortChanged(params: ICellRendererParams): void {
    this.sortChanged.emit(params.columnApi.getColumnState());
  }
  onFirstDataRendered(params: ICellRendererParams): void {
    if (params.columnApi.getColumnState().length > 8) {
      this.autoSizeAll();
    } else {
      this.sizeToFit();
    }
  }

  onDelete(params: ICellRendererParams): void {
    const modelOptions: ModalOptions = {
      animated: true,
    };
    this.bsModalRef = this.modalService.show(DeleteComponent, modelOptions);
    this.bsModalRef.content.deleteModelContent = this.deleteModelContent;
    const observer = this.bsModalRef.content.delete.subscribe(() =>
      this.deleteRow.emit(params.data)
    );
    this.subscriptions.add(observer);
  }

  onFilterChange(params: FloatingFilterSearchData): void {
    this.floatingFilter.emit(params);
  }

  sizeToFit(): void {
    this.agGrid.api.sizeColumnsToFit();
    this.isAutoSize = false;
  }

  autoSizeAll(): void {
    this.agGrid.columnApi.autoSizeAllColumns();
    this.isAutoSize = true;
  }
  onCellDoubleClicked(params: ICellRendererParams): void {
    this.doubleClick.emit(params);
  }
  onHelpSOS(): void {
    this.helpSOS.emit();
  }
}
