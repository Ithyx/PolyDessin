import { TestBed } from '@angular/core/testing';

import { AjoutSvgService } from '../commande/ajout-svg.service';
import { LigneService } from '../stockage-svg/ligne.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { DessinLigneService } from './dessin-ligne.service';
import { INDEX_OUTIL_LIGNE } from './gestionnaire-outils.service';

describe('DessinLigneService', () => {
  let service: DessinLigneService;
  let stockageService: StockageSvgService;
  let element: LigneService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DessinLigneService));
  beforeEach(() => stockageService = TestBed.get(StockageSvgService));

  beforeEach(() => {
    // service.estClicSimple = true;
    service.curseur = ({x: 0, y: 0});
    service.ligne.positionSouris = ({x: 0, y: 0});
    service.ligne.points.push({x: 0, y: 0});
    service.ligne.outil = service.outils.listeOutils[INDEX_OUTIL_LIGNE];
    element = service.ligne;
    stockageService.setSVGEnCours(element);
    service.commandes.dessinEnCours = true;
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
    service.ligne.points = [];
    service.sourisCliquee();
    expect(service.ligne.points).not.toBeNull();
  });

  it('#sourisCliquee devrait changer dessinEnCours à true', () => {
    service.commandes.dessinEnCours = false;
    service.sourisCliquee();
    expect(service.commandes.dessinEnCours).toBe(true);
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

  it('#sourisDoubleClic devrait mettre dessinEnCours à faux', () => {
    service.sourisDoubleClic(new MouseEvent('dblClick'));
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisDoubleClic ne devrait pas appeler executer si le conteneur points est vide', () => {
    service.ligne.points = [];
    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  it('#sourisDoubleClic devrait considérer la ligne comme un polygone si la distance est moins de 3 pixels', () => {
    service.ligne.points.push({x: 0, y: 0});
    service.ligne.points.push({x: 0, y: 0});
    service.ligne.points.push({x: 0, y: 0});
    element = service.ligne;

    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.estPolygone = true;
    element.points.pop();
    element.points.pop();
    element.dessiner();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic ne devrait pas considérer la ligne comme un polygone si la distance est plus de 3 pixels', () => {
    service.ligne.points.push({x: 0, y: 0});
    service.ligne.points.push({x: 0, y: 0});
    service.ligne.points.push({x: 0, y: 0});
    element = service.ligne;

    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.dessiner();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait ajouter le point à la positionSouris si "Avec Points"'
    + ' est choisi', () => {
    service.outils.outilActif.parametres[1].optionChoisie = 'Avec points';
    service.ligne.positionSouris = {x: 25, y: 25};
    element = service.ligne;

    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.points.push({x: 25, y: 25});
    element.dessiner();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait simplement ajouter la ligne au stockageSVG si "Sans Points"'
    + ' est choisi et que la distance du clic est de plus de 3 pixels du point initial', () => {
    service.ligne.points.push({x: 0, y: 0});
    element = service.ligne;
    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.dessiner();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it("#sourisDoubleClic devrait appeler executer si le conteneur points n'est pas vide", () => {
    service.ligne.points.push({x: 0, y: 0});
    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisDoubleClic ne devrait pas appeler executer s\'il n\'y a qu\'un point '
    + 'et que l\'option choisie est sans points', () => {
    spyOn(service.commandes, 'executer');
    service.sourisDoubleClic(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  // TESTS retirerPoint

  it('#retirerPoint devrait rien faire si le conteneur points contient moins que deux point', () => {
    service.ligne.points = [];
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });

  it("#retirerPoint devrait retirer le point du conteneur s'il contient au moins 2 point", () => {
    service.ligne.points.push({x: 1, y: 1});
    service.retirerPoint();
    expect(service.ligne.points).toEqual([{x: 0, y: 0}]);
  });

  it('#retirerPoint devrait appeler actualiserSVG si le point du conteneur contient au moins 2 point', () => {
    service.ligne.points.push({x: 1, y: 1});
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

  // TESTS stockerCurseur

  it('#stockerCurseur devrait contenir les informations sur le curseur X et Y', () => {
    service.positionShiftEnfoncee = ({x: 100, y: 100});
    service.stockerCurseur();
    expect(service.positionShiftEnfoncee).toEqual({x: 0, y: 0});
  });

  // TESTS shiftEnfonce

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 0", () => {
    service.ligne.points.push({x: 100, y: 100});
    service.curseur.x = 150;
    service.curseur.y = 100; // La souris se met à la même hauteur verticale que le dernier point
    service.shiftEnfonce();
    expect(service.ligne.positionSouris).toEqual({x: 150, y: 100});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position en X égale à celle en Y", () => {
    service.ligne.points.push({x: 100, y: 100});
    service.curseur.x = 150;
    service.curseur.y = 150; // La souris se met à 135 degrés du dernier point (en haut à droite)
    service.shiftEnfonce();
    expect(service.ligne.positionSouris).toEqual({x: 150, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position X et Y sont égales et de signe inverse", () => {
    service.ligne.points.push({x: 100, y: 100});
    service.curseur.x = 50;
    service.curseur.y = 150; // La souris se met à 45 degrés du dernier point (en haut à gauche)
    service.shiftEnfonce();
    expect(service.ligne.positionSouris).toEqual({x: 50, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement n'est pas 1 ou 0", () => {
    service.ligne.points.push({x: 100, y: 100});
    service.curseur.x = 100;
    service.curseur.y = 150; // La souris se met sur le même axe verticale que le dernier point
    service.shiftEnfonce();
    expect(service.ligne.positionSouris).toEqual({x: 100, y: 150});
  });

  it('#shiftEnfonce ne devrait rien faire si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.shiftEnfonce();
    expect(service.actualiserSVG).not.toHaveBeenCalled();
  });

  // TESTS shiftRelache

  it('#shiftRelache devrait mettre les informations sur le curseur dans Position', () => {
    service.ligne.positionSouris = ({x: 100, y: 100});
    service.shiftRelache();
    expect(service.ligne.positionSouris).toEqual({x: 0, y: 0});
  });

  it('#shiftRelache devrait appeler actualiserSVG', () => {
    spyOn(service, 'actualiserSVG');
    service.shiftRelache();
    expect(service.actualiserSVG).toHaveBeenCalled();
  });

  // TESTS actualiserSVG

  it("#actualiserSVG devrait actualiser l'outilActif", () => {
    service.outils.outilActif.parametres[0].valeur = 42;
    service.actualiserSVG();
    expect(service.ligne.outil.parametres[0].valeur).toEqual(42);
  });

  it('#actualiserSVG devrait appeler la fonction dessiner de ligne', () => {
    service.ligne.points.push({x: 1, y: 1});
    spyOn(service.ligne, 'dessiner');
    service.actualiserSVG();
    expect(service.ligne.dessiner).toHaveBeenCalled();
  });

  it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
    service.ligne.points.push({x: 1, y: 1});
    // les 2 derniers '0' sont ceux de la position du curseur
    element.points.push({x: 1, y: 1});
    element.dessiner();
    spyOn(stockageService, 'setSVGEnCours');
    service.actualiserSVG();
    expect(stockageService.setSVGEnCours).toHaveBeenCalledWith(element);
  });

  // TESTS vider

  it('#vider devrait mettre le conteneur de points vide', () => {
    service.vider();
    expect(service.ligne.points).toEqual([]);
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
    service.ligne.positionSouris = ({x: 100, y: 100});
    service.vider();
    expect(service.ligne.positionSouris).toEqual({x: 0, y: 0});
  });

});
