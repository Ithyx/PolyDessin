import { TestBed } from '@angular/core/testing';

import { NavigationGuideService } from './navigation-guide.service';

describe('NavigationGuideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationGuideService = TestBed.get(NavigationGuideService);
    expect(service).toBeTruthy();
  });
});
