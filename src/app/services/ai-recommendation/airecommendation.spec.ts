import { TestBed } from '@angular/core/testing';

import { AiRecommendationService } from './airecommendation';

describe('Airecommendation', () => {
  let service: AiRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
