import { TestBed } from '@angular/core/testing';

import { GestionnaireOutilsService } from './gestionnaire-outils.service';

describe('GestionnaireOutilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireOutilsService = TestBed.get(GestionnaireOutilsService);
    expect(service).toBeTruthy();
  });
});
