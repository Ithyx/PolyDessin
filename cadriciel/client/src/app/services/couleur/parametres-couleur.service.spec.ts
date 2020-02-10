import { TestBed } from '@angular/core/testing';

import { ParametresCouleurService } from './parametres-couleur.service';

describe('ParametresCouleurService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametresCouleurService = TestBed.get(ParametresCouleurService);
    expect(service).toBeTruthy();
  });
});
