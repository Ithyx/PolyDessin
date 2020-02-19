import { TestBed } from '@angular/core/testing';

import { RetraitSvgService } from './retrait-svg.service';

describe('RetraitSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetraitSvgService = TestBed.get(RetraitSvgService);
    expect(service).toBeTruthy();
  });
});
