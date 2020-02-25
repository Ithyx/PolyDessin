import { TestBed } from '@angular/core/testing';

import { DrawSprayService } from './draw-spray.service';

describe('DrawSprayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawSprayService = TestBed.get(DrawSprayService);
    expect(service).toBeTruthy();
  });
});
