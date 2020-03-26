import { TestBed } from '@angular/core/testing';

import { SelectionService } from './selection.service';

describe('SelectionService', () => {
  let service: SelectionService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => TestBed.get(SelectionService));

  it('should be created', () => {
    const testService: SelectionService = TestBed.get(SelectionService);
    expect(testService).toBeTruthy();
  });

});
