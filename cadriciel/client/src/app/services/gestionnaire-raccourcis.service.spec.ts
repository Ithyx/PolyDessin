import { TestBed } from '@angular/core/testing';

import { GestionnaireRaccourcisService } from './gestionnaire-raccourcis.service';
import { INDEX_OUTIL_LIGNE, INDEX_OUTIL_RECTANGLE } from './outils/gestionnaire-outils.service';

describe('GestionnaireRaccourcisService', () => {
  let service: GestionnaireRaccourcisService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(GestionnaireRaccourcisService));

  it('should be created', () => {
    const testService: GestionnaireRaccourcisService = TestBed.get(GestionnaireRaccourcisService);
    expect(testService).toBeTruthy();
  });

  // TESTS viderSVGECcours

  it('#viderSVGEnCours devrait vider le SVGEnCours de l\' outil rectange', () => {
    spyOn(service.dessinRectangle, 'vider')
    service.viderSVGEnCours();
    expect(service.dessinRectangle.vider).toHaveBeenCalled();
  });

  it('#viderSVGEnCours devrait vider le SVGEnCours de l\' outil ligne', () => {
    spyOn(service.dessinLigne, 'vider')
    service.viderSVGEnCours();
    expect(service.dessinLigne.vider).toHaveBeenCalled();
  });

  // TESTS traiterInput

  it('#traiterInput devrait mettre rectangle comme outil actif si il reçoit 1', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': '1'});
    spyOn(service, 'viderSVGEnCours');

    service.traiterInput(clavier);

    expect(service.viderSVGEnCours).toHaveBeenCalled();
    expect(service.outils.outilActif.nom).toBe('Rectangle');
  });

  it('#traiterInput devrait mettre crayon comme outil actif si il reçoit c', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'c'});
    spyOn(service, 'viderSVGEnCours');

    service.traiterInput(clavier);

    expect(service.viderSVGEnCours).toHaveBeenCalled();
    expect(service.outils.outilActif.nom).toBe('Crayon');
  });

  it('#traiterInput devrait mettre ligne comme outil actif si il reçoit l', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'l'});
    spyOn(service, 'viderSVGEnCours');

    service.traiterInput(clavier);

    expect(service.viderSVGEnCours).toHaveBeenCalled();
    expect(service.outils.outilActif.nom).toBe('Ligne');
  });

  it('#traiterInput devrait mettre pinceau comme outil actif si il reçoit w', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'w'});
    spyOn(service, 'viderSVGEnCours');

    service.traiterInput(clavier);

    expect(service.viderSVGEnCours).toHaveBeenCalled();
    expect(service.outils.outilActif.nom).toBe('Pinceau');
  });

  it('#traiterInput devrait retirer le dernier point en cours si il reçoit Backspace', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Backspace'});
    service.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
    spyOn(service.dessinLigne, 'retirerPoint');

    service.traiterInput(clavier);

    expect(service.dessinLigne.retirerPoint).toHaveBeenCalled();
  });

  it('#traiterInput devrait annuler la ligne en cours si il reçoit Escape', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Escape'});
    service.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
    spyOn(service.dessinLigne, 'annulerLigne');

    service.traiterInput(clavier);

    expect(service.dessinLigne.annulerLigne).toHaveBeenCalled();
  });

  it('#traiterInput devrait emmettre un nouveau dessin si il reçoit o avec ctrl actif', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'o' , 'ctrlKey': true});
    spyOn(service.emitterNouveauDessin, 'next');

    service.traiterInput(clavier);

    expect(service.emitterNouveauDessin.next).toHaveBeenCalledWith(false);
  });

  it('#traiterInput devrait empeche le declenchement du raccoruci Google Chrome si il reçoit o avec ctrl actif', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'o' , 'ctrlKey': true});
    spyOn(clavier, 'preventDefault');

    service.traiterInput(clavier);

    expect(clavier.preventDefault).toHaveBeenCalled();
  });

  it('#traiterInput devrait appeler stockerCurseur de l\'outil ligne si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Shift'});
    service.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
    spyOn(service.dessinLigne, 'stockerCurseur');

    service.traiterInput(clavier);

    expect(service.dessinLigne.stockerCurseur).toHaveBeenCalled();
  });

  it('#traiterInput devrait appeler ShiftEnfonce de l\'outil rectangle si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Shift'});
    service.outils.changerOutilActif(INDEX_OUTIL_RECTANGLE);
    spyOn(service.dessinRectangle, 'shiftEnfonce');

    service.traiterInput(clavier);

    expect(service.dessinRectangle.shiftEnfonce).toHaveBeenCalled();
  });

  // TESTS traiterToucheRelachee

  it('#traiterToucheRelachee devrait appeler shiftRelache de l\'outil rectangle si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Shift'});
    service.outils.changerOutilActif(INDEX_OUTIL_RECTANGLE);
    spyOn(service.dessinRectangle, 'shiftRelache');

    service.traiterToucheRelachee(clavier);

    expect(service.dessinRectangle.shiftRelache).toHaveBeenCalled();
  });

  it('#traiterToucheRelachee devrait appeler shiftRelache de l\'outil ligne si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { 'key': 'Shift'});
    service.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
    spyOn(service.dessinLigne, 'shiftRelache');

    service.traiterToucheRelachee(clavier);

    expect(service.dessinLigne.shiftRelache).toHaveBeenCalled();
  });

});
