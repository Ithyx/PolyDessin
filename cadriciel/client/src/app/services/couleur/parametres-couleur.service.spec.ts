import { TestBed } from '@angular/core/testing';

import { ParametresCouleurService } from './parametres-couleur.service';

describe('ParametresCouleurService', () => {
  let service: ParametresCouleurService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ParametresCouleurService));

  it('should be created', () => {
    const testService: ParametresCouleurService = TestBed.get(ParametresCouleurService);
    expect(testService).toBeTruthy();
  });

  // TEST intervertirCouleur

  it('#intervetirCouleur devrait échanger la couleur principale et la couleur secondaire', () => {
    const copieCouleurPrincipal = service.couleurPrincipale;
    const copieCouleurSecondaire = service.couleurSecondaire;

    service.intervertirCouleurs();

    expect(service.couleurPrincipale).toBe(copieCouleurSecondaire);
    expect(service.couleurSecondaire).toBe(copieCouleurPrincipal);
  });

  // TEST getCouleurPrincipale

  // TEST getCouleurSecondaire

});
