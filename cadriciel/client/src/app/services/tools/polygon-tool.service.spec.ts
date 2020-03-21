import { TestBed } from '@angular/core/testing';

import { ColorParameterService } from '../color/color-parameter.service';
import { Command } from '../command/command';
import { CommandManagerService } from '../command/command-manager.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { PolygonService } from '../stockage-svg/polygon.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PolygonToolService } from './polygon-tool.service';
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
  setOngoingSVG(element: DrawElement): void { return; }
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
