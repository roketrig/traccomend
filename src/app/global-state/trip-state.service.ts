
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TripStateService {
  private summaryVisibleSubject = new BehaviorSubject<boolean>(false);
  summaryVisible$ = this.summaryVisibleSubject.asObservable();

  /** Summary data gerçekten var mı? (localStorage ve anlamlı içerik) */
  hasSummaryData(): boolean {
    const stored = localStorage.getItem('travelSearchData');
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored);
      return !!parsed; // burada istersen daha sıkı kontroller de ekleyebilirsin
    } catch {
      return false;
    }
  }

  /** Hem flight hem hotel adımları geçildi mi / seçildi mi? */
  private isSummaryComplete(parsedData: any): boolean {
    const flightOk =
      parsedData?.selectedFlight?.passed === true ||
      parsedData?.selectedFlight?.selected === true;

    const hotelOk =
      parsedData?.selectedHotel?.passed === true ||
      parsedData?.selectedHotel?.selected === true;

    return !!(flightOk && hotelOk);
  }

  /** Dışarıdan çağır: görünür mü değil mi güncelle */
  checkSummaryVisibility() {
    const storedData = localStorage.getItem('travelSearchData');
    if (!storedData) {
      this.summaryVisibleSubject.next(false);
      return;
    }

    let parsedData: any = null;
    try {
      parsedData = JSON.parse(storedData);
    } catch {
      this.summaryVisibleSubject.next(false);
      return;
    }

    const isVisible = this.isSummaryComplete(parsedData) && this.hasSummaryData();
    this.summaryVisibleSubject.next(isVisible);
  }

  /** İsteğe bağlı: dışarıdan görünürlüğü zorla kapat/aç (ör. temizleme sonrası) */
  setSummaryVisible(value: boolean) {
    this.summaryVisibleSubject.next(value);
  }
}
