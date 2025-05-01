import { TestBed } from '@angular/core/testing';

import { RNGSeedService } from './rngseed.service';

describe('RNGSeedService', () => {
  let service: RNGSeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RNGSeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
