import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from './canvas-conversion.service';

describe('CanvasConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasConversionService = TestBed.get(CanvasConversionService);
    expect(service).toBeTruthy();
  });
});
