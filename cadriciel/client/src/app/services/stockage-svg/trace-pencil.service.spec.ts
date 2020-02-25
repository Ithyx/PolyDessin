import { TestBed } from '@angular/core/testing';

import { TracePencilService } from './trace-pencil.service';

describe('TraitCrayonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TracePencilService = TestBed.get(TracePencilService);
    expect(service).toBeTruthy();
  });
});
