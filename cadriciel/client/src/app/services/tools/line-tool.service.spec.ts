import { TestBed } from '@angular/core/testing';

import { AjoutSvgService } from '../commande/add-svg.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { LineToolService } from './line-tool.service';
import { LINE_TOOL_INDEX } from './tool-manager.service';

describe('DessinLigneService', () => {
  let service: LineToolService;
  let stockageService: SVGStockageService;
  let element: LineService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(LineToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  beforeEach(() => {
    // service.estClicSimple = true;
    service.cursor = ({x: 0, y: 0});
    service.line.mousePosition = ({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    service.line.tool = service.tools.toolList[LINE_TOOL_INDEX];
    element = service.line;
    stockageService.setOngoingSVG(element);
    service.commandes.dessinEnCours = true;
    // Mettre l'outil ligne comme l'outil actif
    service.tools.activeTool = service.tools.toolList[LINE_TOOL_INDEX];
    service.tools.activeTool.parameters[1].choosenOption = 'Sans points';
  });

  it('should be created', () => {
    const testService: LineToolService = TestBed.get(LineToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee devrait changer la position en x et en y', () => {
    const clic = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.onMouseMove(clic);
    expect(service.cursor).toEqual({x: 100, y: 100});
  });

  it('#sourisDeplacee devrait appeler shiftEnfonce si shift est enfoncé', () => {
    spyOn(service, 'shiftEnfonce');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    expect(service.ShitPress).toHaveBeenCalled();
  });

  it("#sourisDeplacee devrait appeler shiftRelache si shift n'est pas enfoncé", () => {
    spyOn(service, 'shiftRelache');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    expect(service.ShiftRelease).toHaveBeenCalled();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee devrait rajouter x et y au conteneur Point', () => {
    service.line.points = [];
    service.onMouseClick();
    expect(service.line.points).not.toBeNull();
  });

  it('#sourisCliquee devrait changer dessinEnCours à true', () => {
    service.commandes.dessinEnCours = false;
    service.onMouseClick();
    expect(service.commandes.dessinEnCours).toBe(true);
  });

  it("#sourisCliquee ne devrait pas appeler actualiserSVG si c'est un double clic", () => {
    spyOn(service, 'actualiserSVG');
    service.onMouseClick();
    service.onDoubleClick(new MouseEvent('dblclick'));
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler setTimeout', () => {
    spyOn(window, 'setTimeout');
    spyOn(service, 'actualiserSVG');
    service.onMouseClick();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  // TESTS sourisDoubleClic

  it('#sourisDoubleClic devrait mettre dessinEnCours à faux', () => {
    service.onDoubleClick(new MouseEvent('dblClick'));
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisDoubleClic ne devrait pas appeler executer si le conteneur points est vide', () => {
    service.line.points = [];
    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  it('#sourisDoubleClic devrait considérer la ligne comme un polygone si la distance est moins de 3 pixels', () => {
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    element = service.line;

    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.isAPolygon = true;
    element.points.pop();
    element.points.pop();
    element.draw();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic ne devrait pas considérer la ligne comme un polygone si la distance est plus de 3 pixels', () => {
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    element = service.line;

    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.draw();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait ajouter le point à la mousePosition si "Avec Points"'
    + ' est choisi', () => {
    service.tools.activeTool.parameters[1].choosenOption = 'Avec points';
    service.line.mousePosition = {x: 25, y: 25};
    element = service.line;

    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.points.push({x: 25, y: 25});
    element.draw();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait simplement ajouter la ligne au stockageSVG si "Sans Points"'
    + ' est choisi et que la distance du clic est de plus de 3 pixels du point initial', () => {
    service.line.points.push({x: 0, y: 0});
    element = service.line;
    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.draw();
    const ajout = new AjoutSvgService(element, stockageService);
    ajout.cleSVG = 1;
    expect(service.commandes.executer).toHaveBeenCalledWith(ajout);
  });

  it("#sourisDoubleClic devrait appeler executer si le conteneur points n'est pas vide", () => {
    service.line.points.push({x: 0, y: 0});
    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisDoubleClic ne devrait pas appeler executer s\'il n\'y a qu\'un point '
    + 'et que l\'option choisie est sans points', () => {
    spyOn(service.commandes, 'executer');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  // TESTS retirerPoint

  it('#retirerPoint devrait rien faire si le conteneur points contient moins que deux point', () => {
    service.line.points = [];
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it("#retirerPoint devrait retirer le point du conteneur s'il contient au moins 2 point", () => {
    service.line.points.push({x: 1, y: 1});
    service.retirerPoint();
    expect(service.line.points).toEqual([{x: 0, y: 0}]);
  });

  it('#retirerPoint devrait appeler actualiserSVG si le point du conteneur contient au moins 2 point', () => {
    service.line.points.push({x: 1, y: 1});
    spyOn(service, 'actualiserSVG');
    service.retirerPoint();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS stockerCurseur

  it('#stockerCurseur devrait contenir les informations sur le curseur X et Y', () => {
    service.ShiftPressPosition = ({x: 100, y: 100});
    service.stockerCurseur();
    expect(service.ShiftPressPosition).toEqual({x: 0, y: 0});
  });

  // TESTS shiftEnfonce

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 0", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 150;
    service.cursor.y = 100; // La souris se met à la même hauteur verticale que le dernier point
    service.ShitPress();
    expect(service.line.mousePosition).toEqual({x: 150, y: 100});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position en X égale à celle en Y", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 150;
    service.cursor.y = 150; // La souris se met à 135 degrés du dernier point (en haut à droite)
    service.ShitPress();
    expect(service.line.mousePosition).toEqual({x: 150, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement est 1 et la position X et Y sont égales et de signe inverse", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 50;
    service.cursor.y = 150; // La souris se met à 45 degrés du dernier point (en haut à gauche)
    service.ShitPress();
    expect(service.line.mousePosition).toEqual({x: 50, y: 150});
  });

  it("#shiftEnfonce devrait changer la position X et Y si l'alignement n'est pas 1 ou 0", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 100;
    service.cursor.y = 150; // La souris se met sur le même axe verticale que le dernier point
    service.ShitPress();
    expect(service.line.mousePosition).toEqual({x: 100, y: 150});
  });

  it('#shiftEnfonce ne devrait rien faire si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.ShitPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  // TESTS shiftRelache

  it('#shiftRelache devrait mettre les informations sur le curseur dans Position', () => {
    service.line.mousePosition = ({x: 100, y: 100});
    service.ShiftRelease();
    expect(service.line.mousePosition).toEqual({x: 0, y: 0});
  });

  it('#shiftRelache devrait appeler actualiserSVG', () => {
    spyOn(service, 'actualiserSVG');
    service.ShiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS actualiserSVG

  it("#actualiserSVG devrait actualiser l'outilActif", () => {
    service.tools.activeTool.parameters[0].value = 42;
    service.refreshSVG();
    expect(service.line.tool.parameters[0].value).toEqual(42);
  });

  it('#actualiserSVG devrait appeler la fonction draw de ligne', () => {
    service.line.points.push({x: 1, y: 1});
    spyOn(service.line, 'draw');
    service.refreshSVG();
    expect(service.line.draw).toHaveBeenCalled();
  });

  it("#actualiserSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
    service.line.points.push({x: 1, y: 1});
    // les 2 derniers '0' sont ceux de la position du curseur
    element.points.push({x: 1, y: 1});
    element.draw();
    spyOn(stockageService, 'setOngoingSVG');
    service.refreshSVG();
    expect(stockageService.setOngoingSVG).toHaveBeenCalledWith(element);
  });

  // TESTS vider

  it('#vider devrait mettre le conteneur de points vide', () => {
    service.clear();
    expect(service.line.points).toEqual([]);
  });

  it('#vider devrait mettre positionShiftEnfoncee à (x: 0, y: 0)', () => {
    service.ShiftPressPosition = ({x: 100, y: 100});
    service.clear();
    expect(service.ShiftPressPosition).toEqual({x: 0, y: 0});
  });

  it('#vider devrait mettre curseur à (x: 0, y: 0)', () => {
    service.cursor = ({x: 100, y: 100});
    service.clear();
    expect(service.cursor).toEqual({x: 0, y: 0});
  });

  it('#vider devrait mettre position à (x: 0, y: 0)', () => {
    service.line.mousePosition = ({x: 100, y: 100});
    service.clear();
    expect(service.line.mousePosition).toEqual({x: 0, y: 0});
  });

});
