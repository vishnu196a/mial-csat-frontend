import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import {
  DeleteModelContent,
  ErrorResponse,
  FloatingFilterSearchData,
  Pagination,
} from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Contacts, ContactsList } from '../contacts.model';
import { ContactsService } from '../contacts.service';
import {
  SetContactsCurrentPage,
  UpdateContactsGlobalSearch,
  UpdateContactsPerPage,
  ContactsColumnSearch,
} from '../store/contacts.actions';
import { GetContactsGlobalSearch } from '../store/contacts.selector';
import { ContactsColumnDefs } from './contacts.columns';

@Component({
  templateUrl: './list.component.html',
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: Contacts[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;
  deleteModelContent: DeleteModelContent;

  constructor(
    private store: Store<AppState>,
    private contactsService: ContactsService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetContactsGlobalSearch), take(1))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(ContactsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Contacts To Show',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
    this.deleteModelContent = {
      title: 'Delete Contact',
      message: 'Are you sure want to delete the contact?.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new ContactsColumnSearch(searchData));
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadContacts();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateContactsGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetContactsCurrentPage(page));
    this.loadContacts();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateContactsPerPage(perPage));
    this.loadContacts();
  }

  loadContacts(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.contactsService.getContactsList().subscribe(
      (response: ContactsList) => {
        this.pagination = response.pagination;
        this.contacts = response.contacts;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onEdit(params: ICellRendererParams): void {
    const contactId = params.data.id;
    this.router.navigate(['/contacts', contactId, 'edit']);
  }
  onDelete(params: Contacts): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.contactsService.delete(params.id).subscribe(
      () => {
        this.toasterService.success('Successfully deleted the contact');
        this.loadContacts();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
}
