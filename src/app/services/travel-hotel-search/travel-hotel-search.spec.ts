import { TestBed } from '@angular/core/testing';

import { TravelHotelSearch } from './travel-hotel-search';

describe('TravelHotelSearch', () => {
  let service: TravelHotelSearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelHotelSearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
