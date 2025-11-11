import { TestBed } from '@angular/core/testing';

import { FlightOffers } from './flight-offers';

describe('FlightOffers', () => {
  let service: FlightOffers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightOffers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
