import { TestBed } from '@angular/core/testing';

import { GestionnaireOutilsService, INDEX_OUTIL_LIGNE, LISTE_OUTILS} from './gestionnaire-outils.service';

describe('GestionnaireOutilsService', () => {
  let service: GestionnaireOutilsService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(GestionnaireOutilsService));

  it('should be created', () => {
    const testService: GestionnaireOutilsService = TestBed.get(GestionnaireOutilsService);
    expect(testService).toBeTruthy();
  });

  // TESTS trouverIndexParametre

  it('#trouverIndexParametre devrait retourner 0 si le parametre recherché n\'existe pas', () => {
    // L'outil initial du gestionnaire est le crayon
    expect(service.trouverIndexParametre('parametreTest')).toBe(0);
  });

  it('#trouverIndexParametre devrait renvoyer l\'index du parametre recherché', () => {
    service.outilActif = LISTE_OUTILS[INDEX_OUTIL_LIGNE];
    expect(service.trouverIndexParametre('Type de jonction')).toBe(1);
  });

  // TESTS changerOutilActif

  it('#changerOutilActif ne devrait pas changer l\' outil actif si l\'index recherché est invalide', () => {
    service.changerOutilActif(99);
    // L'outil initial du gestionnaire est le crayon
    expect(service.outilActif.nom).toBe('Crayon');
  });

  it('#changerOutilActif devrait changer d\' outil pour celui de l\'index spécifié', () => {
    service.changerOutilActif(INDEX_OUTIL_LIGNE);
    expect(service.outilActif.nom).toBe('Ligne');
  });

  it('#changerOutilActif devrait rendre actif le nouvel outil', () => {
    service.changerOutilActif(INDEX_OUTIL_LIGNE);
    expect(service.outilActif.estActif).toBe(true);
  });

});
