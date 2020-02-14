import { TestBed } from '@angular/core/testing';

import { GestionnaireDessinService } from './gestionnaire-dessin.service';

describe('GestionnaireDessinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireDessinService = TestBed.get(GestionnaireDessinService);
    expect(service).toBeTruthy();
  });
});
