import { TestBed } from '@angular/core/testing';

import { StockageSvgService } from './stockage-svg.service';

describe('StockageSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockageSvgService = TestBed.get(StockageSvgService);
    expect(service).toBeTruthy();
  });
});
