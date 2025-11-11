import { TestBed } from '@angular/core/testing';

import { CitySearch } from './city-search';

describe('CitySearch', () => {
  let service: CitySearch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitySearch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
