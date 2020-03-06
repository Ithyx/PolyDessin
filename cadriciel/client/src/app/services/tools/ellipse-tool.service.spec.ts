import { TestBed } from '@angular/core/testing';

import { EllipseToolService } from './ellipse-tool.service';

describe('EllipseToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EllipseToolService = TestBed.get(EllipseToolService);
    expect(service).toBeTruthy();
  });
});
