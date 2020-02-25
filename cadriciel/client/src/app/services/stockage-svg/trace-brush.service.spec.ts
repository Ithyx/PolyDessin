import { TestBed } from '@angular/core/testing';

import { TraceBrushService } from './trace-brush.service';

describe('TraitPinceauService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraceBrushService = TestBed.get(TraceBrushService);
    expect(service).toBeTruthy();
  });
});
