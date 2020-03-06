import { TestBed } from '@angular/core/testing';

import { ColorChangerToolService } from './color-changer-tool.service';

describe('ColorChangerToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorChangerToolService = TestBed.get(ColorChangerToolService);
    expect(service).toBeTruthy();
  });
});
