import { TestBed } from '@angular/core/testing';

import { DessinPinceauService } from './dessin-pinceau.service';

describe('DessinPinceauService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DessinPinceauService = TestBed.get(DessinPinceauService);
    expect(service).toBeTruthy();
  });
});
