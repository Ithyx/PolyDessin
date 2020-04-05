import { TestBed } from '@angular/core/testing';

import { SavingUtilityService } from './saving-utility.service';

describe('SavingUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SavingUtilityService = TestBed.get(SavingUtilityService);
    expect(service).toBeTruthy();
  });
});
