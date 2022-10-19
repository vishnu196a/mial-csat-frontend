import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GLOBAL_SEARCH_DELAY } from '@shared/constants/constants';
import { debounce } from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() continuousSearch: boolean = true;
  @Input() searchValue: string;
  @Output() search = new EventEmitter<string>();
  @Output() searchChange = new EventEmitter<string>();

  lastSearchedValue: string = '';

  searchDebounce = debounce(function (): void {
    this.onSearch();
  }, GLOBAL_SEARCH_DELAY);

  onSearchModelChange(): void {
    this.searchChange.emit(this.searchValue);
    if (!this.searchValue) {
      this.onSearch();
    } else if (this.continuousSearch) {
      this.searchDebounce();
    }
  }

  onSearch(): void {
    if (this.lastSearchedValue !== this.searchValue) {
      this.lastSearchedValue = this.searchValue;
      this.search.emit(this.searchValue);
    }
  }

  isButtonDisabled(): boolean {
    return this.searchValue === undefined || this.lastSearchedValue === this.searchValue;
  }
}
