import { TestBed } from '@angular/core/testing';

import { DessinLigneService } from './dessin-ligne.service';

describe('DessinLigneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DessinLigneService = TestBed.get(DessinLigneService);
    expect(service).toBeTruthy();
  });
});
