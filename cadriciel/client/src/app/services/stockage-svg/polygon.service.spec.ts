import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    expect(service).toBeTruthy();
  });
});
