import { TestBed } from '@angular/core/testing';

import { AddSVGService } from '../command/add-svg.service';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { LineToolService } from './line-tool.service';
import { TOOL_INDEX } from './tool-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('LineToolService', () => {
  let service: LineToolService;
  let stockageService: SVGStockageService;
  let element: LineService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(LineToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  beforeEach(() => {
    service['cursor'] = ({x: 0, y: 0});
    service['line'].mousePosition = ({x: 0, y: 0});
    service['line'].points = [];
    service['line'].points.push({x: 0, y: 0});
    service['line'].updateParameters(service['tools'].toolList[TOOL_INDEX.LINE]);
    element = service['line'];
    stockageService.setOngoingSVG(element);
    service['commands'].drawingInProgress = true;
    // Mettre l'outil ligne comme l'outil actif
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.LINE];
    service['tools'].activeTool.parameters[1].chosenOption = 'Sans points';
  });

  it('should be created', () => {
    const testService: LineToolService = TestBed.get(LineToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseMove

  it('#onMouseMove devrait changer la position en x et en y', () => {
    const clic = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.onMouseMove(clic);
    expect(service['cursor']).toEqual({x: 100, y: 100});
  });

  it('#onMouseMove devrait appeler shiftPress si shift est enfoncé', () => {
    spyOn(service, 'shiftPress');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: true }));
    expect(service.shiftPress).toHaveBeenCalled();
  });

  it("#onMouseMove devrait appeler shiftRelease si shift n'est pas enfoncé", () => {
    spyOn(service, 'shiftRelease');
    service.onMouseMove(new MouseEvent('mousemove', { shiftKey: false }));
    expect(service.shiftRelease).toHaveBeenCalled();
  });

  // TESTS onMouseClick

  it('#onMouseClick devrait rajouter x et y au conteneur Point', () => {
    service['line'].points = [];
    service.onMouseClick();
    expect(service['line'].points).not.toBeNull();
  });

  it('#onMouseClick devrait changer drawingInProgress à true', () => {
    service['commands'].drawingInProgress = false;
    service.onMouseClick();
    expect(service['commands'].drawingInProgress).toBe(true);
  });

  it('#onMouseClick devrait appeler setTimeout', () => {
    spyOn(window, 'setTimeout');
    spyOn(service, 'refreshSVG');
    service.onMouseClick();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  // TESTS mouseClickCallback
  it("#mouseClickCallback devrait appeler refreshSVG si c'est un simple clic", () => {
    spyOn(service, 'refreshSVG');
    service['isSimpleClick'] = true;
    service.mouseClickCallback();
    expect(service.refreshSVG).toHaveBeenCalled();
  });
  it("#mouseClickCallback ne devrait pas appeler refreshSVG si c'est un double clic", () => {
    spyOn(service, 'refreshSVG');
    service['isSimpleClick'] = false;
    service.mouseClickCallback();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  // TESTS mouseCloseToFirstPoint
  it('#mouseCloseToFirstPoint devrait retourner faux si les valeurs en x sont assez loin', () => {
    expect(service.mouseCloseToFirstPoint(new MouseEvent('click', {clientX: 10, clientY: 1}))).toBe(false);
  });
  it('#mouseCloseToFirstPoint devrait retourner faux si les valeurs en y sont assez loin', () => {
    expect(service.mouseCloseToFirstPoint(new MouseEvent('click', {clientX: 1, clientY: 10}))).toBe(false);
  });
  it('#mouseCloseToFirstPoint devrait retourner faux si les valeurs en x et y sont assez proches', () => {
    expect(service.mouseCloseToFirstPoint(new MouseEvent('click', {clientX: 1, clientY: 1}))).toBe(true);
  });

  // TESTS onDoubleClick

  it('#onDoubleClick devrait mettre drawingInProgress à faux', () => {
    service.onDoubleClick(new MouseEvent('dblClick'));
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  it('#onDoubleClick ne devrait pas appeler execute si le conteneur points est vide', () => {
    service['line'].points = [];
    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onDoubleClick devrait considérer la ligne comme un polygone si mouseCloseToFirstPoint retourne vrai', () => {
    service['line'].points.push({x: 0, y: 0});
    service['line'].points.push({x: 0, y: 0});
    service['line'].points.push({x: 0, y: 0});
    element = service['line'];

    spyOn(service, 'mouseCloseToFirstPoint').and.returnValue(true);
    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.isAPolygon = true;
    element.points.pop();
    element.points.pop();
    element.draw();
    const ajout = new AddSVGService([element], stockageService);
    expect(service['commands'].execute).toHaveBeenCalledWith(ajout);
  });

  it('#onDoubleClick ne devrait pas considérer la ligne comme un polygone si mouseCloseToFirstPoint retourne faux', () => {
    service['line'].points.push({x: 0, y: 0});
    service['line'].points.push({x: 0, y: 0});
    service['line'].points.push({x: 0, y: 0});
    element = service['line'];

    spyOn(service, 'mouseCloseToFirstPoint').and.returnValue(false);
    element = service['line'];

    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 1, clientY: 1}));
    element.draw();
    const ajout = new AddSVGService([element], stockageService);
    expect(service['commands'].execute).toHaveBeenCalledWith(ajout);
  });

  it('#onDoubleClick devrait ajouter le point à la mousePosition si "Avec Points" est choisi', () => {
    service['tools'].activeTool.parameters[1].chosenOption = 'Avec points';
    service['line'].mousePosition = {x: 25, y: 25};
    const test = spyOn(service['line'].points, 'push');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    element.points.push({x: 25, y: 25});
    expect(test).toHaveBeenCalledWith({x: 25, y: 25});
  });

  it('#onDoubleClick devrait simplement ajouter la ligne au stockageSVG si "Sans Points"'
    + ' est choisi et que la distance du clic est de plus de 3 pixels du point initial', () => {
    service['line'].points.push({x: 0, y: 0});
    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    const addSVG = new AddSVGService([element], stockageService);
    expect(service['commands'].execute).toHaveBeenCalledWith(addSVG);
  });

  it("#onDoubleClick devrait appeler execute si le conteneur points n'est pas vide", () => {
    service['line'].points.push({x: 0, y: 0});
    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service['commands'].execute).toHaveBeenCalled();
  });

  it('#onDoubleClick ne devrait pas appeler execute si isEmpty de line retourne vrai', () => {
    spyOn(service['line'], 'isEmpty').and.returnValue(true);
    spyOn(service['commands'], 'execute');
    service.onDoubleClick(new MouseEvent('dblClick', {clientX: 100, clientY: 100}));
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  // TESTS removePoint

  it('#removePoint devrait rien faire si le conteneur points contient moins que deux point', () => {
    service['line'].points = [];
    spyOn(service, 'refreshSVG');
    service.removePoint();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it("#removePoint devrait retirer le point du conteneur s'il contient au moins 2 point", () => {
    service['line'].points.push({x: 1, y: 1});
    service.removePoint();
    expect(service['line'].points).toEqual([{x: 0, y: 0}]);
  });

  it('#removePoint devrait appeler refreshSVG si le point du conteneur contient au moins 2 point', () => {
    service['line'].points.push({x: 1, y: 1});
    spyOn(service, 'refreshSVG');
    service.removePoint();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS shiftPress

  it("#shiftPress devrait changer la position X et Y si l'alignement est 0", () => {
    service['line'].points.push({x: 100, y: 100});
    service['cursor'].x = 150;
    service['cursor'].y = 100; // La souris se met à la même hauteur verticale que le dernier point
    service.shiftPress();
    expect(service['line'].mousePosition).toEqual({x: 150, y: 100});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement est 1 et la position en X égale à celle en Y", () => {
    service['line'].points.push({x: 100, y: 100});
    service['cursor'].x = 150;
    service['cursor'].y = 150; // La souris se met à 135 degrés du dernier point (en haut à droite)
    service.shiftPress();
    expect(service['line'].mousePosition).toEqual({x: 150, y: 150});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement est 1 et la position X et Y sont égales et de signe inverse", () => {
    service['line'].points.push({x: 100, y: 100});
    service['cursor'].x = 50;
    service['cursor'].y = 150; // La souris se met à 45 degrés du dernier point (en haut à gauche)
    service.shiftPress();
    expect(service['line'].mousePosition).toEqual({x: 50, y: 150});
  });

  it("#shiftPress devrait changer la position X et Y si l'alignement n'est pas 1 ou 0", () => {
    service['line'].points.push({x: 100, y: 100});
    service['cursor'].x = 100;
    service['cursor'].y = 150; // La souris se met sur le même axe verticale que le dernier point
    service.shiftPress();
    expect(service['line'].mousePosition).toEqual({x: 100, y: 150});
  });

  it('#shiftPress ne devrait rien faire si drawingInProgress est faux', () => {
    service['commands'].drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.shiftPress();
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  // TESTS shiftRelease

  it('#shiftRelease devrait mettre les informations sur le curseur dans Position', () => {
    service['line'].mousePosition = ({x: 100, y: 100});
    service.shiftRelease();
    expect(service['line'].mousePosition).toEqual({x: 0, y: 0});
  });

  it('#shiftRelease devrait appeler refreshSVG', () => {
    spyOn(service, 'refreshSVG');
    service.shiftRelease();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS refreshSVG

  it('#refreshSVG devrait appeler updateParameters avec l\'outil en cours', () => {
    spyOn(service['line'], 'updateParameters');
    service.refreshSVG();
    expect(service['line'].updateParameters).toHaveBeenCalledWith(service['tools'].activeTool);
  });

  it('#refreshSVG devrait appeler la fonction draw de ligne', () => {
    service['line'].points.push({x: 1, y: 1});
    spyOn(service['line'], 'draw');
    service.refreshSVG();
    expect(service['line'].draw).toHaveBeenCalled();
  });

  it("#refreshSVG devrait retourner un SVG de tous les points sans l'option avec Points", () => {
    service['line'].points.push({x: 1, y: 1});
    element.points.push({x: 1, y: 1});
    element.draw();
    spyOn(stockageService, 'setOngoingSVG');
    service.refreshSVG();
    expect(stockageService.setOngoingSVG).toHaveBeenCalledWith(element);
  });

  // TESTS clear

  it('#clear devrait mettre le conteneur de points vide', () => {
    service.clear();
    expect(service['line'].points).toEqual([]);
  });

  it('#clear devrait mettre cursor à (x: 0, y: 0)', () => {
    service['cursor'] = ({x: 100, y: 100});
    service.clear();
    expect(service['cursor']).toEqual({x: 0, y: 0});
  });

  it('#clear devrait mettre mousePosition à (x: 0, y: 0)', () => {
    service['line'].mousePosition = ({x: 100, y: 100});
    service.clear();
    expect(service['line'].mousePosition).toEqual({x: 0, y: 0});
  });

});
