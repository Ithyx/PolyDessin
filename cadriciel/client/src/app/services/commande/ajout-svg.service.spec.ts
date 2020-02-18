import { TestBed } from '@angular/core/testing';

import { AjoutSvgService } from './ajout-svg.service';

describe('AjoutSvgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AjoutSvgService = TestBed.get(AjoutSvgService);
    expect(service).toBeTruthy();
  });
});
