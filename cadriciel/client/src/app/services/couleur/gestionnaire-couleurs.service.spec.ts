import { TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService } from './gestionnaire-couleurs.service';

describe('GestionnaireCouleursService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireCouleursService = TestBed.get(GestionnaireCouleursService);
    expect(service).toBeTruthy();
  });
});
