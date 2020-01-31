import { TestBed } from '@angular/core/testing';

import { FormulaireNouveauDessinService } from './formulaire-nouveau-dessin.service';

describe('FormulaireNouveauDessinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormulaireNouveauDessinService = TestBed.get(FormulaireNouveauDessinService);
    expect(service).toBeTruthy();
  });
});
