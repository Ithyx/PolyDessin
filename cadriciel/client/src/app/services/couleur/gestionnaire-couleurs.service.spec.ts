import { TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService, Portee } from './gestionnaire-couleurs.service';

describe('GestionnaireCouleursService', () => {
  let service: GestionnaireCouleursService;
  let portee: Portee;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(GestionnaireCouleursService));

  it('should be created', () => {
    const testService: GestionnaireCouleursService = TestBed.get(GestionnaireCouleursService);
    expect(testService).toBeTruthy();
  });

  it('#getCouleur devrait retourner la couleur actuel avec une opacité de 1', () => {
    expect(service.getCouleur()).toBe('rgba(0, 0, 0,1)');
  });

  // TEST modifierRGB

  it('#modifierRGB devrait modifier la couleur avec le nouveau RGB', () => {
    service.RGB = [1, 2, 3];
    service.modifierRGB();

    expect(service.couleur).toBe('rgba(1, 2, 3, ');
  });

  // TESTS appliquerCouleur

  it('#appliquerCouleur devrait changer la couleur principale si la portee est Principale', () => {
    portee = Portee.Principale;
    service.appliquerCouleur(portee);

    expect(service.parametresCouleur.couleurPrincipale).toBe('rgba(0, 0, 0,');
  });

  it('#appliquerCouleur devrait ajouter la couleur au tableau derniereCouleur si la portee est Principale', () => {
    portee = Portee.Principale;
    spyOn(service, 'ajouterDerniereCouleur');
    service.appliquerCouleur(portee);

    expect(service.ajouterDerniereCouleur).toHaveBeenCalled();
  });

  it('#appliquerCouleur devrait changer la couleur secondaire si la portee est Secondaire', () => {
    portee = Portee.Secondaire;
    service.appliquerCouleur(portee);

    expect(service.parametresCouleur.couleurSecondaire).toBe('rgba(0, 0, 0,');
  });

  it('#appliquerCouleur devrait ajouter la couleur au tableau derniereCouleur si la portee est Secondaire', () => {
    portee = Portee.Secondaire;
    spyOn(service, 'ajouterDerniereCouleur');
    service.appliquerCouleur(portee);

    expect(service.ajouterDerniereCouleur).toHaveBeenCalled();
  });

  it('#appliquerCouleur devrait changer la couleur de fond si la portee est Fond', () => {
    portee = Portee.Fond;
    service.appliquerCouleur(portee);

    expect(service.parametresCouleur.couleurFond).toBe('rgba(0, 0, 0,1)');
  });

  it('#appliquerCouleur ne devrait rien faire si la portee est non reconnue', () => {
    portee = Portee.Defaut;
    service.appliquerCouleur(portee);
    spyOn(service, 'ajouterDerniereCouleur');

    expect(service.ajouterDerniereCouleur).not.toHaveBeenCalled();
  });

  // TESTS ajouterDerniereCouleur

  it('#ajouterDerniereCouleur devrait ajouter la couleur au début du tableau dernierCouleur ', () => {
    service.ajouterDerniereCouleur();
    expect(service.parametresCouleur.dernieresCouleurs[0]).toBe(service.couleur);
  });

  /*
  // TESTS RGBversHSL

  it('#RGBversHSL devrait convertir convenablement [R:67, G:80, B:130]', () => {
    expect(service.RGBVersHSL([67, 80, 130])).toEqual([227.6190476190476, 0.31979695431472077, 0.38627450980392153]);
  });
  */
});
