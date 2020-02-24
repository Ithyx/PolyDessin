import { TestBed } from '@angular/core/testing';

import { GestionnaireCommandesService } from './gestionnaire-commandes.service';

describe('GestionnaireCommandesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireCommandesService = TestBed.get(GestionnaireCommandesService);
    expect(service).toBeTruthy();
  });
});
