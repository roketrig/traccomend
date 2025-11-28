import { TestBed } from '@angular/core/testing';

import { TripStateService } from './trip-state.service';

describe('TripStateService', () => {
  let service: TripStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
