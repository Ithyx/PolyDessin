import { TestBed } from '@angular/core/testing';

import { BasicShapeToolService } from './basic-shape-tool.service';

describe('BasicShapeToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicShapeToolService = TestBed.get(BasicShapeToolService);
    expect(service).toBeTruthy();
  });
});
