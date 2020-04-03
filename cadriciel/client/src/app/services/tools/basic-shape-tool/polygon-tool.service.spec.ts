import { TestBed } from '@angular/core/testing';

import { ColorParameterService } from '../../color/color-parameter.service';
import { Command } from '../../command/command';
import { CommandManagerService } from '../../command/command-manager.service';
import { PolygonService } from '../../stockage-svg/draw-element/basic-shape/polygon.service';
import { DrawElement } from '../../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { DrawingTool, ToolManagerService } from '../tool-manager.service';
import { DEFAULT_SIDES, PolygonToolService } from './polygon-tool.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

const activeToolStub: DrawingTool = {
  name: 'stubActif',
  isActive: true,
  ID: 0,
  parameters: [{type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
               {type: 'select', name: 'Type', options: ['A', 'B'], chosenOption: 'A'},
               {type: 'number', name: 'Nombre de côtés', value: 4, min: 3, max: 12}],
  iconName: ''
};

const toolManagerStub: Partial<ToolManagerService> = {
  toolList: [activeToolStub],
  activeTool: activeToolStub
};

const colorParameterStub: Partial<ColorParameterService> = {
  primaryColor: {RGBA: [45, 0, 0, 1], RGBAString: 'rgba(45,0,0,1)'},
  secondaryColor: {RGBA: [0, 0, 45, 1], RGBAString: 'rgba(0,0,46,1)'}
};

const stockageStub: Partial<SVGStockageService> = {
  setOngoingSVG(element: DrawElement): void { return; },
  addSVG(element: DrawElement): void { return; }
};

const commandStub: Partial<CommandManagerService> = {
  drawingInProgress: true,
  execute(command: Command): void { return; }
};

describe('PolygonToolService', () => {
  let service: PolygonToolService;
  let tools: ToolManagerService;
  let commands: CommandManagerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ {provide: ToolManagerService, useValue: toolManagerStub},
                 {provide: ColorParameterService, useValue: colorParameterStub},
                 {provide: SVGStockageService, useValue: stockageStub},
                 {provide: CommandManagerService, useValue: commandStub} ]
  }));
  beforeEach(() => {
    service = TestBed.get(PolygonToolService);
    tools = TestBed.get(ToolManagerService);
    commands = TestBed.get(CommandManagerService);
    service['shape'].primaryColor = {RGBA: [0, 0, 0, 1], RGBAString: 'rgba(0,0,0,1)'};
    service['shape'].secondaryColor = {RGBA: [0, 0, 0, 1], RGBAString: 'rgba(0,0,0,1)'};
    service['shape'].points = [{x: 50, y: 0}, {x: 90, y: 80}, {x: 10, y: 80}];
    service['shape'].pointMin = {x: 0, y: 0};
    service['shape'].pointMax = {x: 100, y: 100};
    service['initial'] = {x: 100, y: 100};
    service['calculatedCenter'] = {x: 50, y: 50};
    service['calculatedRadius'] = 50;
    service['minPoint'] = {x: 10, y: 80};
    service['commands'].drawingInProgress = true;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS onMouseMove

  it('#onMouseMove ne devrait rien faire si commands.drawingInProgress est false', () => {
    spyOn(service, 'refreshSVG');
    commands.drawingInProgress = false;
    service.onMouseMove(new MouseEvent('move'));
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it('#onMouseMove devrait avoir la moitié de la longueur comme rayon si elle est inférieure à la hauteur', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['calculatedRadius']).toBe(5);
  });

  it('#onMouseMove devrait avoir la moitié de la hauteur comme rayon si elle est inférieure à la longueur', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 115, clientY: 110}));
    expect(service['calculatedRadius']).toBe(5);
  });

  it('#onMouseMove devrait soustraire le rayon du centre en x si le x de la souris est inférieur au x initial', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 90, clientY: 115}));
    expect(service['calculatedCenter'].x).toBe(95);
  });

  it('#onMouseMove devrait soustraire le rayon du centre en y si le y de la souris est inférieur au y initial', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 115, clientY: 90}));
    expect(service['calculatedCenter'].y).toBe(95);
  });

  it('#onMouseMove devrait additionner le rayon au centre en x si le x de la souris est supérieur au x initial', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['calculatedCenter'].x).toBe(105);
  });

  it('#onMouseMove devrait additionner le rayon au centre en y si le y de la souris est supérieur au y initial', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 115, clientY: 110}));
    expect(service['calculatedCenter'].y).toBe(105);
  });

  it('#onMouseMove devrait assigner une valeur par défaut au point minimal correspondant au premier point en x', () => {
    spyOn(service, 'calculatePoints').and.callFake(() => { return; });  // pour éviter que la valeur change
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['minPoint']).toEqual({x: 105, y: 0});
  });

  it('#onMouseMove devrait appeler calculatePoints avec le nombre de côtés s\'il est défini', () => {
    tools.activeTool.parameters[2].value = 12;
    spyOn(service, 'calculatePoints');
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service.calculatePoints).toHaveBeenCalledWith(12);
  });

  it('#onMouseMove devrait appeler calculatePoints avec DEFAULT_SIDES si le nombre de côtés n\'est pas défini', () => {
    tools.activeTool.parameters[2].value = undefined;
    spyOn(service, 'calculatePoints');
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service.calculatePoints).toHaveBeenCalledWith(DEFAULT_SIDES);
  });

  it('#onMouseMove devrait calculer le point minimal du polygone pour le périmètre', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['shape'].pointMin).toEqual({x: 100, y: 100});
  });

  it('#onMouseMove devrait calculer le point maximal du polygone pour le périmètre', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['shape'].pointMax).toEqual({x: 110, y: 110});
  });

  it('#onMouseMove ne devrait pas appeler calculateNewCircle si le nombre de côtés est pair', () => {
    spyOn(service, 'calculateNewCircle');
    service.onMouseMove(new MouseEvent('move', {clientX: 200, clientY: 200}));
    expect(service.calculateNewCircle).not.toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler calculateNewCircle si le nombre de côtés est impair', () => {
    tools.activeTool.parameters[2].value = 3;
    spyOn(service, 'calculateNewCircle');
    service.onMouseMove(new MouseEvent('move', {clientX: 200, clientY: 200}));
    expect(service.calculateNewCircle).toHaveBeenCalled();
  });

  it('#onMouseMove ne devrait pas appeler calculatePoints une deuxième fois si le nouveau centre en y est NaN', () => {
    tools.activeTool.parameters[2].value = 3;
    spyOn(service, 'calculateNewCircle').and.callFake(() => { service['calculatedCenter'].y = NaN; });
    spyOn(service, 'calculatePoints');
    service.onMouseMove(new MouseEvent('move', {clientX: 200, clientY: 200}));
    expect(service.calculatePoints).toHaveBeenCalledTimes(1);
  });

  it('#onMouseMove devrait appeler calculatePoints une deuxième fois si le nouveau centre en y est défini', () => {
    tools.activeTool.parameters[2].value = 3;
    spyOn(service, 'calculateNewCircle').and.callFake(() => { service['calculatedCenter'].y = 5; });
    spyOn(service, 'calculatePoints');
    service.onMouseMove(new MouseEvent('move', {clientX: 200, clientY: 200}));
    expect(service.calculatePoints).toHaveBeenCalledTimes(2);
  });

  // TESTS calculatePoints

  it('#calculatePoints devrait calculer les points ajoutés avec les coordonnées du centre, le rayon et l\'angle', () => {
    service.calculatePoints(3);
    const x = 50 + 50 * Math.cos(5 * Math.PI / 6);
    const y = 50 + 50 * Math.sin(5 * Math.PI / 6);
    expect(service['shape'].points[2].x).toBeCloseTo(x);
    expect(service['shape'].points[2].y).toBeCloseTo(y);
  });

  it('#calculatePoints devrait actualiser le point minimal si le point calculé est inférieur en x', () => {
    service['minPoint'] = {x: 100, y: 0};
    service.calculatePoints(1);
    expect(service['minPoint']).toEqual({x: 50, y: 0});
  });

  it('#calculatePoints ne devrait pas actualiser le point minimal si le point calculé est supérieur en x', () => {
    service['minPoint'] = {x: 0, y: 0};
    service.calculatePoints(1);
    expect(service['minPoint']).toEqual({x: 0, y: 0});
  });

  it('#calculatePoints devrait mettre autant de points dans le polygone que le paramètre sides', () => {
    service.calculatePoints(9);
    expect(service['shape'].points.length).toBe(9);
  });

  // TESTS calculateNewCircle

  it('#calculateNewCircle devrait appeler calculateRadius avec le centre en x, les coordonnées du premier point '
    + 'et les coordonnées du nouveau point minimal en x calculé', () => {
    spyOn(service, 'calculateRadius');
    service.calculateNewCircle();
    expect(service.calculateRadius).toHaveBeenCalledWith(50, 0, 0, 100);
  });

  it('#calculateNewCircle devrait actualiser la valeur de calculatedRadius', () => {
    service.calculateNewCircle();
    expect(service['calculatedRadius']).toEqual(service.calculateRadius(50, 0, 0, 100));
  });

  it('#calculateNewCircle devrait calculer la nouvelle coordonnée en y du centre', () => {
    service.calculateNewCircle();
    expect(service['calculatedCenter'].y).toEqual(service.calculateRadius(50, 0, 0, 100));
  });

  // TEST calculateRadius

  it('#calculateRadius devrait retourner le nouveau rayon calculé avec les points en paramètre', () => {
    expect(service.calculateRadius(1, 2, 3, 4)).toEqual(2);
  });

  // TESTS clear

  it('#clear devrait mettre commandes.drawingInProgress faux', () => {
    service['commands'].drawingInProgress = true;
    service.clear();
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  it('#clear devrait reinitialiser le polygone', () => {
    service['shape'] = new PolygonService();
    service['shape'].points = [{x: 0, y: 0}, {x: 10, y: 10}];
    service.clear();
    // vérifier que le SVG est vide
    expect(service['shape']).toEqual(new PolygonService());
  });

  it('#clear devrait mettre (0,0) à initial', () => {
    service['initial'] = {x: 15, y: 15};
    service.clear();
    expect(service['initial']).toEqual({x: 0, y: 0});
  });

  it('#clear devrait mettre (0,0) à calculatedCenter', () => {
    service['calculatedCenter'] = {x: 15, y: 15};
    service.clear();
    expect(service['calculatedCenter']).toEqual({x: 0, y: 0});
  });

  it('#clear devrait mettre 0 à calculatedRadius', () => {
    service['calculatedRadius'] = 28;
    service.clear();
    expect(service['calculatedRadius']).toEqual(0);
  });
});
