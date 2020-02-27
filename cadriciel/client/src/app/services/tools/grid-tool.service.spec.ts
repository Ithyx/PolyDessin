import { TestBed } from '@angular/core/testing';

import { GridToolService } from './grid-tool.service';

describe('OutilGrilleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridToolService = TestBed.get(GridToolService);
    expect(service).toBeTruthy();
  });
});
