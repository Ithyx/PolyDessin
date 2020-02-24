import { TestBed } from '@angular/core/testing';

import { TraitPinceauService } from './trait-pinceau.service';

describe('TraitPinceauService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraitPinceauService = TestBed.get(TraitPinceauService);
    expect(service).toBeTruthy();
  });
});
