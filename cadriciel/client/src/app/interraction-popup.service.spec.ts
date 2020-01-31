import { TestBed } from '@angular/core/testing';

import { InterractionPopupService } from './interraction-popup.service';

describe('InterractionPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterractionPopupService = TestBed.get(InterractionPopupService);
    expect(service).toBeTruthy();
  });
});
