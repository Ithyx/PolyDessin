import { TestBed } from '@angular/core/testing';

import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { Command } from '../command/command';
import { CommandManagerService } from '../command/command-manager.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { PolygonService } from '../stockage-svg/polygon.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { DEFAULT_SIDES, PolygonToolService } from './polygon-tool.service';
import { DrawingTool, ToolManagerService } from './tool-manager.service';

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
  let colorParameter: ColorParameterService;
  let stockage: SVGStockageService;
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
    colorParameter = TestBed.get(ColorParameterService);
    stockage = TestBed.get(SVGStockageService);
    commands = TestBed.get(CommandManagerService);
    service['polygon'].primaryColor = {RGBA: [0, 0, 0, 1], RGBAString: 'rgba(0,0,0,1)'};
    service['polygon'].secondaryColor = {RGBA: [0, 0, 0, 1], RGBAString: 'rgba(0,0,0,1)'};
    service['polygon'].points = [{x: 50, y: 0}, {x: 90, y: 80}, {x: 10, y: 80}];
    service['polygon'].pointMin = {x: 0, y: 0};
    service['polygon'].pointMax = {x: 100, y: 100};
    service['initial'] = {x: 100, y: 100};
    service['calculatedCenter'] = {x: 50, y: 50};
    service['calculatedRadius'] = 50;
    service['minPoint'] = {x: 10, y: 80};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS refreshSVG

  it('#refreshSVG devrait appeler updateParameters du polygone avec l\'outil actif', () => {
    spyOn(service['polygon'], 'updateParameters');
    service.refreshSVG();
    expect(service['polygon'].updateParameters).toHaveBeenCalledWith(tools.activeTool);
  });

  it('#refreshSVG devrait changer la couleur primaire du polygone avec celle de colorParameter', () => {
    service.refreshSVG();
    expect(service['polygon'].primaryColor).toEqual(colorParameter.primaryColor);
  });

  it('#refreshSVG devrait changer la couleur secondaire du polygone avec celle de colorParameter', () => {
    service.refreshSVG();
    expect(service['polygon'].secondaryColor).toEqual(colorParameter.secondaryColor);
  });

  it('#refreshSVG devrait appeler draw du polygone', () => {
    spyOn(service['polygon'], 'draw');
    service.refreshSVG();
    expect(service['polygon'].draw).toHaveBeenCalled();
  });

  it('#refreshSVG devrait appeler setOngoingSVG de SVGStockage avec le polygone', () => {
    spyOn(stockage, 'setOngoingSVG');
    service.refreshSVG();
    expect(stockage.setOngoingSVG).toHaveBeenCalledWith(service['polygon']);
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
    expect(service['polygon'].pointMin).toEqual({x: 100, y: 100});
  });

  it('#onMouseMove devrait calculer le point maximal du polygone pour le périmètre', () => {
    service.onMouseMove(new MouseEvent('move', {clientX: 110, clientY: 115}));
    expect(service['polygon'].pointMax).toEqual({x: 110, y: 110});
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
    expect(service['polygon'].points[2].x).toBeCloseTo(x);
    expect(service['polygon'].points[2].y).toBeCloseTo(y);
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
    expect(service['polygon'].points.length).toBe(9);
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

  // TESTS onMousePress

  it('#onMousePress ne devrait rien faire si commands.drawingInProgress est true', () => {
    service.onMousePress(new MouseEvent('press', {clientX: 0, clientY: 0}));
    expect(service['initial']).toEqual({x: 100, y: 100});
  });

  it('#onMousePress devrait actualiser le point initial aux coordonnées de la souris si commands.drawingInProgress est false', () => {
    commands.drawingInProgress = false;
    service.onMousePress(new MouseEvent('press', {clientX: 0, clientY: 0}));
    expect(service['initial']).toEqual({x: 0, y: 0});
  });

  it('#onMousePress devrait mettre commands.drawingInProgress à true si sa valeur est false', () => {
    commands.drawingInProgress = false;
    service.onMousePress(new MouseEvent('press'));
    expect(commands.drawingInProgress).toBe(true);
  });

  // TESTS onMouseRelease

  it('#onMouseRelease devrait mettre commands.drawingInProgress à false', () => {
    service.onMouseRelease();
    expect(commands.drawingInProgress).toBe(false);
  });

  it('#onMouseRelease devrait appeler execute de commands si le polygone a une longueur ou une largeur non nulle', () => {
    const command = new AddSVGService(service['polygon'], stockage);
    spyOn(commands, 'execute');
    service.onMouseRelease();
    expect(commands.execute).toHaveBeenCalledWith(command);
  });

  it('#onMouseRelease ne devrait pas appeler execute de commands si le polygone a une longueur et une largeur nulles', () => {
    service['polygon'].pointMax = {x: 0, y: 0};
    spyOn(commands, 'execute');
    service.onMouseRelease();
    expect(commands.execute).not.toHaveBeenCalled();
  });

  it('#onMouseRelease devrait remettre le centre à (0, 0)', () => {
    service.onMouseRelease();
    expect(service['calculatedCenter']).toEqual({x: 0, y: 0});
  });

  it('#onMouseRelease devrait remettre le rayon à 0', () => {
    service.onMouseRelease();
    expect(service['calculatedRadius']).toBe(0);
  });

  it('#onMouseRelease devrait réinitialiser le polygone', () => {
    service.onMouseRelease();
    expect(service['polygon']).toEqual(new PolygonService());
  });

  it('#onMouseRelease devrait appeler setOngoingSVG de SVGStockage avec le polygone vide', () => {
    spyOn(stockage, 'setOngoingSVG');
    service.onMouseRelease();
    expect(stockage.setOngoingSVG).toHaveBeenCalledWith(new PolygonService());
  });

  // TESTS clear

  it('#clear devrait mettre drawingInProgress de commands à false', () => {
    service.clear();
    expect(commands.drawingInProgress).toEqual(false);
  });

  it('#clear devrait reinitialiser le polygone', () => {
    service['polygon'].points.push({x: 1, y: 1});
    service['polygon'].points.push({x: 0, y: 2});
    service['polygon'].points.push({x: 2, y: 2});
    service['polygon'].draw();
    service.clear();
    expect(service['polygon']).toEqual(new PolygonService());
  });
});
