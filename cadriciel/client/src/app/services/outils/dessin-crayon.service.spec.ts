import { TestBed } from '@angular/core/testing';

import { DessinCrayonService } from './dessin-crayon.service';

describe('DessinCrayonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DessinCrayonService = TestBed.get(DessinCrayonService);
    expect(service).toBeTruthy();
  });
});
