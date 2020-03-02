import { TestBed } from '@angular/core/testing';

import { PipetteToolService } from './pipette-tool.service';

describe('PipetteToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PipetteToolService = TestBed.get(PipetteToolService);
    expect(service).toBeTruthy();
  });
});
