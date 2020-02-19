import { TestBed } from '@angular/core/testing';

import { ChangementCouleurFondService } from './changement-couleur-fond.service';

describe('ChangementCouleurFondService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangementCouleurFondService = TestBed.get(ChangementCouleurFondService);
    expect(service).toBeTruthy();
  });
});
