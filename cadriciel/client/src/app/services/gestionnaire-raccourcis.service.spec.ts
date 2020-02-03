import { TestBed } from '@angular/core/testing';

import { GestionnaireRaccourcisService } from './gestionnaire-raccourcis.service';

describe('GestionnaireRaccourcisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestionnaireRaccourcisService = TestBed.get(GestionnaireRaccourcisService);
    expect(service).toBeTruthy();
  });
});
