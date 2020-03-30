import { TestBed } from '@angular/core/testing';

import { BasicShapeService } from './basic-shape.service';

describe('BasicShapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicShapeService = TestBed.get(BasicShapeService);
    expect(service).toBeTruthy();
  });
});
