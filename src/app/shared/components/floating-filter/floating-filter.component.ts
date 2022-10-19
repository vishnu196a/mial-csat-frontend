import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GLOBAL_SEARCH_DELAY } from '@shared/constants/constants';
import { IFilterParams } from 'ag-grid-community';
import { debounce } from 'lodash';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

export interface FilterParams extends IFilterParams {
  filterParams: { context: any; filterParams: FilterParams };
  stateName: string;
}

@Component({
  templateUrl: './floating-filter.component.html',
  styleUrls: ['./floating-filter.component.scss'],
})
export class FloatingFilterComponent implements OnDestroy {
  public currentValue: string;
  filterParams: FilterParams;
  subscriptions = new Subscription();

  onSearchChanged = debounce(function (params: string): void {
    const searchData = {
      [this.filterParams.column.getId()]: params,
    };
    this.filterParams.filterParams.context.componentParent.onFilterChange(searchData);
  }, GLOBAL_SEARCH_DELAY);

  constructor(private store: Store<AppState>) {}

  agInit(params: FilterParams): void {
    this.filterParams = params;
    const filteredColumnName: string = params.column.getId();
    if (params.filterParams.context.stateName) {
      const observer = this.store
        .select(params.filterParams.context.stateName)
        .subscribe((stateValue) => {
          this.currentValue = stateValue.columns[filteredColumnName] || '';
        });
      this.subscriptions.add(observer);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
