import { TestBed } from '@angular/core/testing';

import { TranslateSvgService } from './translate-svg.service';

describe('TranslateSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TranslateSvgService = TestBed.get(TranslateSvgService);
    expect(service).toBeTruthy();
  });
});
