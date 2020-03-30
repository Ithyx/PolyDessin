import { TestBed } from '@angular/core/testing';

import { DrawingManagerService } from './drawing-manager.service';

describe('DrawingManagerServer', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingManagerService = TestBed.get(DrawingManagerService);
    expect(service).toBeTruthy();
  });
});
