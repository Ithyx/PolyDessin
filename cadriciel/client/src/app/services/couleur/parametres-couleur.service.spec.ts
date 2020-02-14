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

  it('#getCouleurPrincipale devrait retourner la couleur principale avec une opacité de 1', () => {
    expect(service.getCouleurPrincipale()).toBe('rgba(0, 0, 0, 1)')
  });

  // TEST getCouleurSecondaire

  it('#getCouleurSecondaire devrait retourner la couleur secondaire avec une opacité de 1', () => {
    expect(service.getCouleurSecondaire()).toBe('rgba(0, 0, 0, 1)')
  });

});
