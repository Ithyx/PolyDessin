import { TestBed } from '@angular/core/testing';

import { TraceService } from './trace.service';

describe('TraceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraceService = TestBed.get(TraceService);
    expect(service).toBeTruthy();
  });
});
