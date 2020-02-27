import { TestBed } from '@angular/core/testing';

import { SelectionBoxService } from './selection-box.service';

describe('SelectionBoxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectionBoxService = TestBed.get(SelectionBoxService);
    expect(service).toBeTruthy();
  });
});
