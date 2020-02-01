import { TestBed } from '@angular/core/testing';

import { DessinManagerService } from './dessin-manager.service';

describe('DessinManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DessinManagerService = TestBed.get(DessinManagerService);
    expect(service).toBeTruthy();
  });
});
