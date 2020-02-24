import { TestBed } from '@angular/core/testing';

import { SelectionRectangleService } from './selection-rectangle.service';

describe('SelectionRectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionRectangleService = TestBed.get(SelectionRectangleService);
    expect(service).toBeTruthy();
  });
});
