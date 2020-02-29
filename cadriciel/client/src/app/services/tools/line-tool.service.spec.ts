import { TestBed } from '@angular/core/testing';

import { AddSVGService } from '../command/add-svg.service';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { LineToolService } from './line-tool.service';
import { TOOL_INDEX } from './tool-manager.service';

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
    service.line.tool = service.tools.toolList[TOOL_INDEX.LINE];
    element = service.line;
    stockageService.setOngoingSVG(element);
    service.commands.drawingInProgress = true;
    // Mettre l'outil ligne comme l'outil actif
    service.tools.activeTool = service.tools.toolList[TOOL_INDEX.LINE];
    service.tools.activeTool.parameters[1].chosenOption = 'Sans points';
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

  it('#sourisDeplacee devrait appeler shiftPress si shift est enfoncé', () => {
    spyOn(service, 'shiftPress');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    expect(service.shiftPress).toHaveBeenCalled();
  });

  it("#sourisDeplacee devrait appeler shiftRelease si shift n'est pas enfoncé", () => {
    spyOn(service, 'shiftRelease');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    expect(service.shiftRelease).toHaveBeenCalled();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee devrait rajouter x et y au conteneur Point', () => {
    service.line.points = [];
    service.onMouseClick();
    expect(service.line.points).not.toBeNull();
  });

  it('#sourisCliquee devrait changer drawingInProgress à true', () => {
    service.commands.drawingInProgress = false;
    service.onMouseClick();
    expect(service.commands.drawingInProgress).toBe(true);
  });

  it("#sourisCliquee ne devrait pas appeler refreshSVG si c'est un double clic", () => {
    spyOn(service, 'refreshSVG');
    service.onMouseClick();
    service.onDoubleClick(new MouseEvent('dblclick'));
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler setTimeout', () => {
    spyOn(window, 'setTimeout');
    spyOn(service, 'refreshSVG');
    service.onMouseClick();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  // TESTS sourisDoubleClic

  it('#sourisDoubleClic devrait mettre drawingInProgress à faux', () => {
    service.onDoubleClick(new MouseEvent('dblClick'));
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it('#sourisDoubleClic ne devrait pas appeler execute si le conteneur points est vide', () => {
    service.line.points = [];
    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commands.execute).not.toHaveBeenCalled();
  });

  it('#sourisDoubleClic devrait considérer la ligne comme un polygone si la distance est moins de 3 pixels', () => {
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    element = service.line;

    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.isAPolygon = true;
    element.points.pop();
    element.points.pop();
    element.draw();
    const ajout = new AddSVGService(element, stockageService);
    ajout.svgKey = 1;
    expect(service.commands.execute).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic ne devrait pas considérer la ligne comme un polygone si la distance est plus de 3 pixels', () => {
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    service.line.points.push({x: 0, y: 0});
    element = service.line;

    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.draw();
    const ajout = new AddSVGService(element, stockageService);
    ajout.svgKey = 1;
    expect(service.commands.execute).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait ajouter le point à la mousePosition si "Avec Points"'
    + ' est choisi', () => {
    service.tools.activeTool.parameters[1].chosenOption = 'Avec points';
    service.line.mousePosition = {x: 25, y: 25};
    element = service.line;

    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.points.push({x: 25, y: 25});
    element.draw();
    const ajout = new AddSVGService(element, stockageService);
    ajout.svgKey = 1;
    expect(service.commands.execute).toHaveBeenCalledWith(ajout);
  });

  it('#sourisDoubleClic devrait simplement ajouter la ligne au stockageSVG si "Sans Points"'
    + ' est choisi et que la distance du clic est de plus de 3 pixels du point initial', () => {
    service.line.points.push({x: 0, y: 0});
    element = service.line;
    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.draw();
    const ajout = new AddSVGService(element, stockageService);
    ajout.svgKey = 1;
    expect(service.commands.execute).toHaveBeenCalledWith(ajout);
  });

  it("#sourisDoubleClic devrait appeler execute si le conteneur points n'est pas vide", () => {
    service.line.points.push({x: 0, y: 0});
    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commands.execute).toHaveBeenCalled();
  });

  it('#sourisDoubleClic ne devrait pas appeler execute s\'il n\'y a qu\'un point '
    + 'et que l\'option choisie est sans points', () => {
    spyOn(service.commands, 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service.commands.execute).not.toHaveBeenCalled();
  });

  // TESTS retirerPoint

  it('#retirerPoint devrait rien faire si le conteneur points contient moins que deux point', () => {
    service.line.points = [];
    spyOn(service, 'refreshSVG');
    service.retirerPoint();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it("#retirerPoint devrait retirer le point du conteneur s'il contient au moins 2 point", () => {
    service.line.points.push({x: 1, y: 1});
    service.retirerPoint();
    expect(service.line.points).toEqual([{x: 0, y: 0}]);
  });

  it('#retirerPoint devrait appeler refreshSVG si le point du conteneur contient au moins 2 point', () => {
    service.line.points.push({x: 1, y: 1});
    spyOn(service, 'refreshSVG');
    service.retirerPoint();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS memorizeCursor

  it('#memorizeCursor devrait contenir les informations sur le curseur X et Y', () => {
    service.shiftPressPosition = ({x: 100, y: 100});
    service.memorizeCursor();
    expect(service.shiftPressPosition).toEqual({x: 0, y: 0});
  });

  // TESTS shiftPress

  it("#shiftPress devrait changer la position X et Y si l'alignement est 0", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 150;
    service.cursor.y = 100; // La souris se met à la même hauteur verticale que le dernier point
    service.shiftPress();
    expect(service.line.mousePosition).toEqual({x: 150, y: 100});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement est 1 et la position en X égale à celle en Y", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 150;
    service.cursor.y = 150; // La souris se met à 135 degrés du dernier point (en haut à droite)
    service.shiftPress();
    expect(service.line.mousePosition).toEqual({x: 150, y: 150});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement est 1 et la position X et Y sont égales et de signe inverse", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 50;
    service.cursor.y = 150; // La souris se met à 45 degrés du dernier point (en haut à gauche)
    service.shiftPress();
    expect(service.line.mousePosition).toEqual({x: 50, y: 150});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement n'est pas 1 ou 0", () => {
    service.line.points.push({x: 100, y: 100});
    service.cursor.x = 100;
    service.cursor.y = 150; // La souris se met sur le même axe verticale que le dernier point
    service.shiftPress();
    expect(service.line.mousePosition).toEqual({x: 100, y: 150});
  });

  it('#shiftPress ne devrait rien faire si drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  // TESTS shiftRelease

  it('#shiftRelease devrait mettre les informations sur le curseur dans Position', () => {
    service.line.mousePosition = ({x: 100, y: 100});
    service.shiftRelease();
    expect(service.line.mousePosition).toEqual({x: 0, y: 0});
  });

  it('#shiftRelease devrait appeler refreshSVG', () => {
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS refreshSVG

  it("#refreshSVG devrait actualiser l'outilActif", () => {
    service.tools.activeTool.parameters[0].value = 42;
    service.refreshSVG();
    expect(service.line.tool.parameters[0].value).toEqual(42);
  });

  it('#refreshSVG devrait appeler la fonction draw de ligne', () => {
    service.line.points.push({x: 1, y: 1});
    spyOn(service.line, 'draw');
    service.refreshSVG();
    expect(service.line.draw).toHaveBeenCalled();
  });

  it("#refreshSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
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

  it('#vider devrait mettre positionshiftPresse à (x: 0, y: 0)', () => {
    service.shiftPressPosition = ({x: 100, y: 100});
    service.clear();
    expect(service.shiftPressPosition).toEqual({x: 0, y: 0});
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
