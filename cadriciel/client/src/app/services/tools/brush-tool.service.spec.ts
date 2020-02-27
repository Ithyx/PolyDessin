import { TestBed } from '@angular/core/testing';

import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { BrushToolService } from './brush-tool.service';
import { EMPTY_TOOL } from './tool-manager.service';

describe('DessinPinceauService', () => {
  let service: BrushToolService;
  let stockageService: SVGStockageService;
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(BrushToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  // Mettre l'outil pinceau comme l'outil actif
  beforeEach(() => {
    service.commandes.dessinEnCours = true;
    service.canClick = true;
    service.tools.activeTool = service.tools.toolList[1];
    service.tools.activeTool.parameters[0].value = 5;

    element = new TraceBrushService();
    stockageService.setOngoingSVG(element);
    service.trace.SVG = 'L';
  });

  it('should be created', () => {
    const testService: BrushToolService = TestBed.get(BrushToolService);
    expect(testService).toBeTruthy();
  });

    // TESTS sourisCliquee

  it('#sourisCliquee devrait mettre peutCliquer vrai si peutCliquer est faux initialement', () => {
      service.canClick = false;
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.canClick).toBe(true);
  });

  it('#sourisCliquee  devrait mettre dessinEnCours faux si peutCliquer est vrai', () => {
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it("#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai et que l'outil crayon n'a pas d'épaisseur", () => {
      service.tools.activeTool.parameters[0].value = 0;
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it("#sourisCliquee devrait seulement être appelé si l'outil crayon a une épaisseur", () => {
      service.tools.activeTool.parameters[0].value = 0;
      service.trace.isAPoint = false;
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.trace.isAPoint).toBe(false);
  });

  it('#sourisCliquee devrait appeler actualiserSVG après un clic avec crayon', () => {
      const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
      spyOn(service, 'actualiserSVG');
      service.onMouseClick(clic);
      expect(service.refreshSVG).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait appeler executer de commande après un clic avec crayon', () => {
      const clic = new MouseEvent('click', { clientX: 100, clientY: 100 });
      spyOn(service.commandes, 'executer');
      service.onMouseClick(clic);
      expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisCliquee devrait mettre dessinEnCours faux si peutCliquer est vrai', () => {
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisCliquee devrait mettre réinitialiser trait à ses paramètres par défaut si peutCliquer est vrai', () => {
      service.onMouseClick(new MouseEvent('onclick'));
      expect(service.trace).toEqual(new TraceBrushService());
  });

  // TESTS sourisDeplacee

  it('#sourisDeplacee ne devrait rien effectuer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service, 'actualiserSVG');
    service.onMouseMove(new MouseEvent('release'));
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  it('#sourisDeplacee devrait ajouter la position de la souris au tableau de points', () => {
    service.trace.points = [];
    service.commandes.dessinEnCours = true;
    service.onMouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.trace.points[0]).toEqual({x: 100, y: 100});
  });

  it('#sourisDeplacee devrait appeler actualiserSVG si dessinEnCours est vrai', () => {
    spyOn(service, 'actualiserSVG');
    service.onMouseMove(new MouseEvent('release'));
    expect(service.refreshSVG).toHaveBeenCalled();
  });

   // TESTS sourisEnfoncee

  it('#sourisEnfoncee devrait mettre dessinEnCours vrai', () => {
    service.commandes.dessinEnCours = false;
    service.onMousePress();
    expect(service.commandes.dessinEnCours).toBe(true);
  });

  it('#sourisEnfoncee devrait appeler actualiserSVG', () => {
    spyOn(service, 'actualiserSVG');
    service.onMousePress();
    expect(service.refreshSVG).toHaveBeenCalled();
  });

 // TESTS sourisRelachee

  it('#sourisRelachee devrait rien effectuer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    service.canClick = false;
    service.onMouseRelease();
    expect(service.canClick).toBe(false);
  });

  it("#sourisRelachee devrait changer peutCliquer à vrai si SVG de trait ne contient pas 'L'", () => {
    service.trace.SVG = 'P';
    service.onMouseRelease();
    expect(service.canClick).toBe(true);
  });

  it("#sourisRelachee  devrait appeler executer de commandes si le SVG contient 'L'", () => {
    spyOn(service.commandes, 'executer');
    service.onMouseRelease();
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisRelachee devrait réinitialiser trait à ses paramètres par défaut si dessinEnCours est vrai', () => {
    service.onMouseRelease();
    expect(service.trace).toEqual(new TraceBrushService());
  });

  it('#sourisRelachee devrait mettre dessinEnCours faux si dessinEnCours est vrai au debut de la fonction', () => {
    service.onMouseRelease();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisRelachee devrait mettre peutCliquer vrai si dessinEnCours est vrai au debut de la fonction', () => {
    service.onMouseRelease();
    expect(service.canClick).toBe(true);
  });

  // TESTS sourisSortie

  it('#sourisSortie ne devrait pas appeler executer si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    spyOn(service.commandes, 'executer');
    service.onMouseLeave();
    expect(service.commandes.executer).not.toHaveBeenCalled();
  });

  it('#sourisSortie devrait appeler executer si dessinEnCours est vrai', () => {
    spyOn(service.commandes, 'executer');
    service.onMouseLeave();
    expect(service.commandes.executer).toHaveBeenCalled();
  });

  it('#sourisSortie devrait reinitialiser le trait en cours si dessinEnCours est vrai', () => {
    service.onMouseLeave();
    expect(service.trace).toEqual(new TraceBrushService());
  });

  it('#sourisSortie devrait mettre dessinEnCours faux si dessinEnCours est vrai', () => {
    service.onMouseLeave();
    expect(service.commandes.dessinEnCours).toBe(false);
  });

  it('#sourisSortie devrait mettre peutCliquer faux si dessinEnCours est faux', () => {
    service.commandes.dessinEnCours = false;
    service.onMouseLeave();
    expect(service.canClick).toBe(false);
  });

  // TESTS actualiserSVG

  it('#actualiserSVG devrait changer la couleur du trait', () => {
    service.trace.primaryColor = 'test';
    service.refreshSVG();
    expect(service.trace.primaryColor).toEqual(service.couleur.getCouleurPrincipale());
  });

  it('#actualiserSVG devrait changer l\'outil du trait', () => {
    service.trace.tool = EMPTY_TOOL;
    service.refreshSVG();
    expect(service.trace.tool).toEqual(service.tools.activeTool);
  });

  it('#actualiserSVG devrait appeler dessiner du trait', () => {
    spyOn(service.trace, 'draw');
    service.refreshSVG();
    expect(service.trace.draw).toHaveBeenCalled();
  });

  it('#actualiserSVG devrait appeler setSVGEnCours avec le trait', () => {
    spyOn(stockageService, 'setOngoingSVG');
    service.refreshSVG();
    expect(stockageService.setOngoingSVG).toHaveBeenCalledWith(service.trace);
  });
});
