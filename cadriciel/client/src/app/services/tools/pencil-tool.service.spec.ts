import { TestBed } from '@angular/core/testing';

import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { DrawingToolService } from './pencil-tool.service';
import { EMPTY_TOOL } from './tool-manager.service';

describe('DessinCrayonService', () => {
  let service: DrawingToolService;
  let stockageService: SVGStockageService;
  let element: TracePencilService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DrawingToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  beforeEach(() => {
    service.commands.drawingInProgress = true;
    service.canClick = true;
    service.tools.activeTool = service.tools.toolList[0];
    service.tools.activeTool.parameters[0].value = 5;

    element = new TracePencilService();
    element.tool = service.tools.toolList[0];
    element.primaryColor = 'rgba(0, 0, 0, 1)';

    stockageService.setOngoingSVG(element);
    service.trace.SVG = 'L';
  });

  it('should be created', () => {
    const testService: DrawingToolService = TestBed.get(DrawingToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS sourisCliquee

  it('#sourisCliquee devrait mettre peutCliquer vrai si peutCliquer est faux initialement', () => {
    service.canClick = false;
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.canClick).toBe(true);
  });

  it('#sourisCliquee  devrait mettre drawingInProgress faux si peutCliquer est vrai', () => {
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it("#sourisCliquee devrait mettre drawingInProgress faux si peutCliquer est vrai et que l'outil crayon n'a pas d'épaisseur", () => {
    service.tools.activeTool.parameters[0].value = 0;
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it("#sourisCliquee devrait seulement être appelé si l'outil crayon a une épaisseur", () => {
    service.tools.activeTool.parameters[0].value = 0;
    service.trace.isAPoint = false;
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.trace.isAPoint).toBe(false);
  });

  it('#sourisCliquee devrait appeler refreshSVG après un clic avec crayon', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(service, 'refreshSVG');
    service.onMouseClick(clic);
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler execute de commande après un clic avec crayon', () => {
    const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
    spyOn(service.commands, 'execute');
    service.onMouseClick(clic);
    expect(service.commands.execute).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait mettre drawingInProgress faux si peutCliquer est vrai', () => {
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it('#sourisCliquee devrait mettre réinitialiser trait à ses paramètres par défaut si peutCliquer est vrai', () => {
    service.onMouseClick(new MouseEvent('onclick'));
    expect(service.trace).toEqual(new TracePencilService());
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee ne devrait rien effectuer si drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service, 'refreshSVG');
    service.onMouseMove(new MouseEvent('release'));
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait ajouter la position de la souris au tableau de points', () => {
    service.trace.points = [];
    service.commands.drawingInProgress = true;
    service.onMouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.trace.points[0]).toEqual({x: 100, y: 100});
  });

  it('#sourisDeplacee devrait appeler refreshSVG si drawingInProgress est vrai', () => {
    spyOn(service, 'refreshSVG');
    service.onMouseMove(new MouseEvent('release'));
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre drawingInProgress vrai', () => {
    service.commands.drawingInProgress = false;
    service.onMousePress();
    expect(service.commands.drawingInProgress).toBe(true);
  });

  it('#sourisEnfoncee devrait appeler refreshSVG', () => {
    spyOn(service, 'refreshSVG');
    service.onMousePress();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // TESTS sourisRelachee

  it('#sourisRelachee devrait rien effectuer si drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    service.canClick = false;
    service.onMouseRelease();
    expect(service.canClick).toBe(false);
  });

  it("#sourisRelachee devrait changer peutCliquer à vrai si SVG de trait ne contient pas 'L'", () => {
    service.trace.SVG = 'P';
    service.onMouseRelease();
    expect(service.canClick).toBe(true);
  });

  it("#sourisRelachee  devrait appeler execute de commands si le SVG contient 'L'", () => {
    spyOn(service.commands, 'execute');
    service.onMouseRelease();
    expect(service.commands.execute).toHaveBeenCalled();
  });

  it('#sourisRelachee devrait réinitialiser trait à ses paramètres par défaut si drawingInProgress est vrai', () => {
    service.onMouseRelease();
    expect(service.trace).toEqual(new TracePencilService());
  });

  it('#sourisRelachee devrait mettre drawingInProgress faux si drawingInProgress est vrai au debut de la fonction', () => {
    service.onMouseRelease();
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it('#sourisRelachee devrait mettre peutCliquer vrai si drawingInProgress est vrai au debut de la fonction', () => {
    service.onMouseRelease();
    expect(service.canClick).toBe(true);
  });

  // TESTS sourisSortie

  it('#sourisSortie ne devrait pas appeler execute si drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    spyOn(service.commands, 'execute');
    service.onMouseLeave();
    expect(service.commands.execute).not.toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler execute si drawingInProgress est vrai', () => {
    spyOn(service.commands, 'execute');
    service.onMouseLeave();
    expect(service.commands.execute).toHaveBeenCalled();
  });

  it('#sourisSortie devrait reinitialiser le trait en cours si drawingInProgress est vrai', () => {
    service.onMouseLeave();
    expect(service.trace).toEqual(new TracePencilService());
  });

  it('#sourisSortie devrait mettre drawingInProgress faux si drawingInProgress est vrai', () => {
    service.onMouseLeave();
    expect(service.commands.drawingInProgress).toBe(false);
  });

  it('#sourisSortie devrait mettre peutCliquer faux si drawingInProgress est faux', () => {
    service.commands.drawingInProgress = false;
    service.onMouseLeave();
    expect(service.canClick).toBe(false);
  });

  // TESTS refreshSVG

  it('#refreshSVG devrait changer la couleur du trait', () => {
    service.trace.primaryColor = 'test';
    service.refreshSVG();
    expect(service.trace.primaryColor).toEqual(service.colorParameter.getPrimaryColor());
  });

  it('#refreshSVG devrait changer l\'outil du trait', () => {
    service.trace.tool = EMPTY_TOOL;
    service.refreshSVG();
    expect(service.trace.tool).toEqual(service.tools.activeTool);
  });

  it('#refreshSVG devrait appeler dessiner du trait', () => {
    spyOn(service.trace, 'draw');
    service.refreshSVG();
    expect(service.trace.draw).toHaveBeenCalled();
  });

  it('#refreshSVG devrait appeler setOngoingSVG avec le trait', () => {
    spyOn(stockageService, 'setOngoingSVG');
    service.refreshSVG();
    expect(stockageService.setOngoingSVG).toHaveBeenCalledWith(service.trace);
  });
});
