import { TestBed } from '@angular/core/testing';

import { TraitCrayonService } from './trait-crayon.service';

describe('TraitCrayonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraitCrayonService = TestBed.get(TraitCrayonService);
    expect(service).toBeTruthy();
  });
});
