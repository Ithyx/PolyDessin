import { TestBed } from '@angular/core/testing';

import { ColorFillService } from './color-fill.service';

describe('ColorFillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorFillService = TestBed.get(ColorFillService);
    expect(service).toBeTruthy();
  });
});
