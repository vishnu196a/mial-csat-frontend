import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LIST_NO_OF_ROWS_OPTIONS } from '@shared/constants/constants';
import { Pagination } from '@shared/models/shared.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() pagination: Pagination;
  @Output() pageChange = new EventEmitter<number>();
  @Output() perPageChange = new EventEmitter<number>();

  perPageOptions: number[] = LIST_NO_OF_ROWS_OPTIONS;

  onFirstPageClick(): void {
    this.pageChange.emit(1);
  }

  onPreviousPageClick(): void {
    this.pageChange.emit(this.pagination.prev_page);
  }

  onNextPageClick(): void {
    this.pageChange.emit(this.pagination.next_page);
  }

  onLastPageClick(): void {
    this.pageChange.emit(this.pagination.total_pages);
  }

  onPerPageChange(event): void {
    // this.pageChange.emit(1);
    this.perPageChange.emit(event.target.value);
  }
}
