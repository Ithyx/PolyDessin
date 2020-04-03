import { TestBed } from '@angular/core/testing';

import { RoutingManagerService } from './routing-manager.service';

describe('RoutingManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingManagerService = TestBed.get(RoutingManagerService);
    expect(service).toBeTruthy();
  });
});
