import { TestBed } from '@angular/core/testing';

import { LocalSaveManagerService } from './local-save-manager.service';

describe('LocalSaveManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalSaveManagerService = TestBed.get(LocalSaveManagerService);
    expect(service).toBeTruthy();
  });
});
