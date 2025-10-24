import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private cityCodeSource = new BehaviorSubject<string>('');
  cityCode$ = this.cityCodeSource.asObservable();

  updateCityCode(code: string) {
    this.cityCodeSource.next(code);
  }
}
