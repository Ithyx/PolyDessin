import { TestBed } from '@angular/core/testing';

import { TransformSvgService } from './transform-svg.service';

describe('TransformSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransformSvgService = TestBed.get(TransformSvgService);
    expect(service).toBeTruthy();
  });
});
