import { TestBed } from '@angular/core/testing';

import { TravelRecommendations } from './travel-recommendations';

describe('TravelRecommendations', () => {
  let service: TravelRecommendations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelRecommendations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
