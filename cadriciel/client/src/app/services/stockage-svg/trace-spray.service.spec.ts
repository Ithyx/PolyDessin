import { TestBed } from '@angular/core/testing';

import { TraceSprayService } from './trace-spray.service';

describe('TraceSprayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraceSprayService = TestBed.get(TraceSprayService);
    expect(service).toBeTruthy();
  });
});
