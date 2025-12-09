
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TripStateService {
  private summaryVisibleSubject = new BehaviorSubject<boolean>(false);
  summaryVisible$ = this.summaryVisibleSubject.asObservable();


  checkSummaryVisibility() {
    const storedData = localStorage.getItem('travelSearchData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      const flightOk =
        parsedData.selectedFlight?.passed === true ||
        parsedData.selectedFlight?.selected === true;

      const hotelOk =
        parsedData.selectedHotel?.passed === true ||
        parsedData.selectedHotel?.selected === true;

      const isVisible = flightOk && hotelOk;

      this.summaryVisibleSubject.next(isVisible);
    } else {
      this.summaryVisibleSubject.next(false);
    }
  }


   //   } else if (!storedData) {
     // this.summaryVisibleSubject.next(false);

}
