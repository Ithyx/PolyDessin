import { TestBed } from '@angular/core/testing';

import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { DessinLigneService } from './dessin-ligne.service';
import { INDEX_OUTIL_LIGNE } from './gestionnaire-outils.service';

describe('DessinLigneService', () => {
  let SVG = '';
  let service: DessinLigneService;
  let stockageService: StockageSvgService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinLigneService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));

  beforeEach(() => {
    // service.estClicSimple = true;
    service.curseur = ({x: 0, y: 0});
    service.position = ({x: 0, y: 0});
    service.points.push({x: 0, y: 0});
    stockageService.setSVGEnCours('<svg />');
    // Mettre l'outil ligne comme l'outil actif
    service.outils.outilActif = service.outils.listeOutils[INDEX_OUTIL_LIGNE];
    service.outils.outilActif.parametres[1].optionChoisie = 'Sans points';
  });

  it('should be created', () => {
    const testService: DessinLigneService = TestBed.get(DessinLigneService);
    expect(testService).toBeTruthy();
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee devrait changer la position en x et en y', () => {
    const clic = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.sourisDeplacee(clic);
    expect(service.curseur).toEqual({x: 100, y: 100});
  });

  it('#sourisDeplacee devrait appeler shiftEnfonce si shift est enfoncé', () => {
    spyOn(service, 'shiftEnfonce');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: true }));
    expect(service.shiftEnfonce).toHaveBeenCalled();
  });

  it("#sourisDeplacee devrait appeler shiftRelache si shift n'est pas enfoncé", () => {
    spyOn(service, 'shiftRelache');
    service.sourisDeplacee(new MouseEvent('mousemove', { shiftKey: false }));
    expect(service.shiftRelache).toHaveBeenCalled();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee devrait rajouter x et y au conteneur Point', () => {
    service.points = [];
    service.sourisCliquee();
    expect(service.points).not.toBeNull();
  });

  it("#sourisCliquee ne devrait pas appeler actualiserSVG si c'est un double clic", () => {
    spyOn(service, 'actualiserSVG');
    service.sourisCliquee();
    service.sourisDoubleClic(new MouseEvent('dblclick'));
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler setTimeout', () => {
    spyOn(window, 'setTimeout');
    spyOn(service, 'actualiserSVG');
    service.sourisCliquee();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  // TESTS sourisDoubleClic

  it("#sourisDoubleClic devrait rien faire si le conteneur points n'est pas vide", () => {
    service.points = [];
    spyOn(stockageService, 'ajouterSVG');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(stockageService.ajouterSVG).not.toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic devrait appeler ajouterSVG si la différence entre le offset et le premier point mémoriser' +
      'est plus grand ou égal à 3 pour X', () => {
      service.points = [];
      service.points.push({x: 150, y: 0});
      SVG = '<svg" />';
      spyOn(stockageService, 'ajouterSVG');
      service.sourisDoubleClic(new MouseEvent('dblClick', { clientX: 100, clientY: 100 }));
      expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic devrait appeler ajouterSVG si la différence entre le offset et le premier point mémoriser' +
      'est plus grand ou égal à 3 pour Y', () => {
    service.points = [];
    service.points.push({x: 0, y: 150});
    SVG = '<svg" />';
    spyOn(stockageService, 'ajouterSVG');
    service.sourisDoubleClic(new MouseEvent('dblClick', { clientX: 100, clientY: 100 }));
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic devrait rajouter les points au SVG', () => {
    service.points.push({x: 1, y: 1});
    // Mettre deux autres points quelconque qui seront pop par la fonction
    service.points.push({x: 1, y: 1});
    service.points.push({x: 1, y: 1});
    SVG = '<polygon fill="none" stroke="black" stroke-width="5" points="0 0 1 1 " />';
    spyOn(stockageService, 'ajouterSVG');
    service.sourisDoubleClic(new MouseEvent('dblClick', { clientX: 2, clientY: 2 }));
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic devrait modifier les points en AvecPoints si le clic est en dessous de 3 pixels', () => {
    service.outils.outilActif.parametres[1].optionChoisie = 'Avec points';
    service.points.push({x: 1, y: 1});
    // Mettre deux autres points quelconque qui seront pop par la fonction
    service.points.push({x: 1, y: 1});
    service.points.push({x: 1, y: 1});
    SVG = '<polygon fill="none" stroke="black" stroke-width="5" points="0 0 1 1 " />';
    spyOn(service, 'avecPoints');
    service.sourisDoubleClic(new MouseEvent('dblClick', { clientX: 2, clientY: 2 }));
    expect(service.avecPoints).toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic ne devrait pas ajouter le avecPoints au SVG si le double clic est au dessus de 3 pixels', () => {
    SVG = '<svg" />';
    spyOn(stockageService, 'ajouterSVG');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVG);
  });

  it('#sourisDoubleClic devrait ajouter le avecPoints au SVG si le double clic est au dessus de 3 pixels', () => {
    service.outils.outilActif.parametres[1].optionChoisie = 'Avec points';
    SVG = '<svg" /> <circle cx="0" cy="0" r="5" fill="black"/>';
    spyOn(stockageService, 'ajouterSVG');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(stockageService.ajouterSVG).toHaveBeenCalledWith(SVG);
  });

  it("#sourisDoubleClic devrait appeler setSVGEnCours si le conteneur points n'est pas vide", () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith('');
  });

  it("#sourisDoubleClic devrait mettre le conteneur points vide si le conteneur points n'est pas vide", () => {
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.points).toEqual([]);
  });

  // TESTS avecPoints

  it('#avecPoints devrait créer un cercle SVG pour chaque point', () => {
    service.points.push({x: 1, y: 1});
    SVG = ' <circle cx="0" cy="0" r="5" fill="black"/> <circle cx="1" cy="1" r="5" fill="black"/>';
    let testSVG: string;
    testSVG = '';
    testSVG = service.avecPoints(testSVG);
    expect(testSVG).toBe(SVG);
  });

  // TESTS retirerPoint

  it('#retirerPoint devrait rien faire si le conteneur points contient moins que deux point', () => {
    service.points = [];
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });

  it("#retirerPoint devrait retirer le point du conteneur s'il contient au moins 2 point", () => {
    service.points.push({x: 1, y: 1});
    service.retirerPoint();
    expect(service.points).toEqual([{x: 0, y: 0}]);
  });

  it('#retirerPoint devrait actualiserSVG si le point du conteneur contient au moins 2 point', () => {
    service.points.push({x: 1, y: 1});
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

  // TESTS annulerLigne

  it('#annulerLigne devrait appeler setSVGEnCours', () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.annulerLigne();
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith('');
  });

  it('#annulerLigne devrait mettre le conteneur de points vide', () => {
    service.annulerLigne();
    expect(service.points).toEqual([]);
  });

  // TESTS stockerCurseur

  it('#stockerCurseur devrait contenir les informations sur le curseur X et Y', () => {
    service.positionShiftEnfoncee = ({x: 100, y: 100});
    service.stockerCurseur();
    expect(service.positionShiftEnfoncee).toEqual({x: 0, y: 0});
  });

  // TESTS shiftEnfonce

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 0", () => {
    service.points.push({x: 100, y: 100});
    service.curseur.x = 150;
    service.curseur.y = 100; // La souris se met à la même hauteur verticale que le dernier point
    service.shiftEnfonce();
    expect(service.position).toEqual({x: 150, y: 100});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position en X égale à celle en Y", () => {
    service.points.push({x: 100, y: 100});
    service.curseur.x = 150;
    service.curseur.y = 150; // La souris se met à 135 degrés du dernier point (en haut à droite)
    service.shiftEnfonce();
    expect(service.position).toEqual({x: 150, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position X et Y sont égales et de signe inverse", () => {
    service.points.push({x: 100, y: 100});
    service.curseur.x = 50;
    service.curseur.y = 150; // La souris se met à 45 degrés du dernier point (en haut à gauche)
    service.shiftEnfonce();
    expect(service.position).toEqual({x: 50, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement n'est pas 1 ou 0", () => {
    service.points.push({x: 100, y: 100});
    service.curseur.x = 100;
    service.curseur.y = 150; // La souris se met sur le même axe verticale que le dernier point
    service.shiftEnfonce();
    expect(service.position).toEqual({x: 100, y: 150});
  });

  // TESTS shiftRelache

  it('#shiftRelache devrait mettre les informations sur le curseur dans Position', () => {
    service.position = ({x: 100, y: 100});
    service.shiftRelache();
    expect(service.position).toEqual({x: 0, y: 0});
  });

  // TESTS actualiserSVG

  it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
    service.points.push({x: 1, y: 1});
    // les 2 derniers '0' sont ceux de la position du curseur
    SVG = '<polyline fill="none" stroke="black" stroke-width="5" points="0 0 1 1 0 0"/>';
    spyOn(stockageService, 'setSVGEnCours');
    service.actualiserSVG();
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith(SVG);
  });

  it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
    service.outils.outilActif.parametres[1].optionChoisie = 'Avec points';
    service.points.push({x: 1, y: 1});
    // les 2 derniers '0' sont ceux de la position du curseur
    SVG = '<polyline fill="none" stroke="black" stroke-width="5" points="0 0 1 1 0 0"/>';
    spyOn(service, 'avecPoints');
    service.actualiserSVG();
    expect(service.avecPoints).toHaveBeenCalledWith(SVG);
  });

  // TESTS vider

  it('#vider devrait mettre le conteneur de points vide', () => {
    service.vider();
    expect(service.points).toEqual([]);
  });

  it('#vider devrait mettre positionShiftEnfoncee à (x: 0, y: 0)', () => {
    service.positionShiftEnfoncee = ({x: 100, y: 100});
    service.vider();
    expect(service.positionShiftEnfoncee).toEqual({x: 0, y: 0});
  });

  it('#vider devrait mettre curseur à (x: 0, y: 0)', () => {
    service.curseur = ({x: 100, y: 100});
    service.vider();
    expect(service.curseur).toEqual({x: 0, y: 0});
  });

  it('#vider devrait mettre position à (x: 0, y: 0)', () => {
    service.position = ({x: 100, y: 100});
    service.vider();
    expect(service.position).toEqual({x: 0, y: 0});
  });

  it('#vider devrait appeler setSVGEnCours', () => {
    spyOn(stockageService, 'setSVGEnCours');
    service.vider();
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith('');
  });
});
