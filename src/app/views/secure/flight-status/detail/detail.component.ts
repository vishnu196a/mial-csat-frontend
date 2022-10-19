import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FLIGHT_DETAILS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { forEach } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FlightStatusDetails } from '../flight-status.model';
import { FlightStatusService } from '../flight-status.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  templateUrl: './detail.component.html',
})
export class FlightStatusDetailComponent implements OnInit, OnDestroy {
  flightStatusId: number;
  isLoading: boolean = false;
  hasDetails: boolean = false;
  flightDetails = [];
  private subscriptions = new Subscription();

  constructor(
    private flightStatusService: FlightStatusService,
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.flightStatusId = this.route.snapshot.params.id;
    this.getFlightStatusDetails();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  getFlightStatusDetails(): void {
    this.isLoading = true;
    const observer = this.flightStatusService.getFlightStatusDetails(this.flightStatusId).subscribe(
      (flightDetailsResponse: FlightStatusDetails) => {
        if (flightDetailsResponse) {
          flightDetailsResponse.updated_dt = this.shared.getFormattedDate(
            flightDetailsResponse.updated_dt
          );
        }
        forEach(flightDetailsResponse, (value, key) => {
          if (key.includes('_time')) {
            value = this.shared.getFormattedDate(value.toString());
          }

          key = FLIGHT_DETAILS[key] || key;
          value = !value || value === 'null' ? '-' : value;
          if (!key.includes('_')) {
            this.flightDetails.push({ key: key, value: value });
          }
        });
        this.flightDetails.sort((a, b) => {
          return a.key < b.key ? -1 : 1;
        });
        this.hasDetails = true;
        this.isLoading = false;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasDetails = false;
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
}
