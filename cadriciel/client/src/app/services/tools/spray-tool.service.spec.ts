import { TestBed } from '@angular/core/testing';

import { Observable, Subscription } from 'rxjs';
import { SprayService } from '../stockage-svg/spray.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { SprayToolService } from './spray-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('DrawSprayService', () => {
  let service: SprayToolService;
  let stockageService: SVGStockageService;
  let element: SprayService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SprayToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  beforeEach(() => {
    service['commands'].drawingInProgress = true;
    service['tools'].activeTool = service['tools'].toolList[2];
    service['tools'].activeTool.parameters[0].value = 5;

    element = new SprayService();
    element.updateParameters(service['tools'].toolList[2]);
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    service.intervalSubscription = new Subscription();

    stockageService.setOngoingSVG(element);
    service.trace.svg = 'L';
  });

  it('should be created', () => {
    const testService: SprayToolService = TestBed.get(SprayToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseMove

  it('#onMouseMove devrait ajouter la position de la souris au tableau de points', () => {
    service.mousePosition = {x: 10, y: 10};
    service.onMouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.mousePosition).toEqual({x: 100, y: 100});
  });

  it('#onMouseMove ne devrait pas ajouter la position de la souris au tableau de points', () => {
    service.mousePosition = {x: 10, y: 10};
    service['commands'].drawingInProgress = false;
    service.onMouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.mousePosition).toEqual({x: 10, y: 10});
  });

  // TESTS onMousePress

  it('#onMousePress devrait appeler la fonction resetTrace', () => {
    spyOn(service, 'resetTrace');
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(service.resetTrace).toHaveBeenCalled();
  });

  it('#onMousePress devrait mettre drawingInProgress vrai même si frequence est 0', () => {
    service['tools'].activeTool.parameters[1].value = 0;
    service['commands'].drawingInProgress = false;
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(service['commands'].drawingInProgress).toBe(true);
  });

  it('#onMousePress devrait assigner la position en paramètre à mousePosition', () => {
    service.mousePosition = {x: 10, y: 10};
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(service.mousePosition).toEqual({x: 100, y: 100});
  });

  it('#onMousePress devrait appeler unsubscribe si intervalSubscription est vrai', () => {
    const test = spyOn(Subscription.prototype, 'unsubscribe');
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(test).toHaveBeenCalled();
  });

  it('#onMousePress ne devrait pas appeler unsubscribe si intervalSubscription n\'est pas défini', () => {
    delete service.intervalSubscription;
    const test = spyOn(Subscription.prototype, 'unsubscribe');
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(test).not.toHaveBeenCalled();
  });

  it('#onMousePress devrait appeler la fonction interval avec un paramètre par rapport à la fréquence', () => {
    service['tools'].activeTool.parameters[1].value = 10;
    const test = spyOn(Observable.prototype, 'subscribe');
    service.onMousePress(new MouseEvent('onClick', { clientX: 100, clientY: 100 }));
    expect(test).toHaveBeenCalled();
  });

  // TESTS onMouseRelease

  it('#onMouseRelease ne devrait pas appeler execute si drawingInProgress est faux', () => {
    service['commands'].drawingInProgress = false;
    spyOn(service['commands'], 'execute');
    service.onMouseRelease();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onMouseRelease ne devrait pas appeler execute si points n\'est pas vide', () => {
    service.trace.points = [];
    spyOn(service['commands'], 'execute');
    service.onMouseRelease();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onMouseRelease devrait appeler execute si les conditions sont satisfaites', () => {
    service.trace.points.push({x: 10, y: 10});
    spyOn(service['commands'], 'execute');
    service.onMouseRelease();
    expect(service['commands'].execute).toHaveBeenCalled();
  });

  it('#onMouseRelease devrait appeler resetTrace', () => {
    spyOn(service, 'resetTrace');
    service.onMouseRelease();
    expect(service.resetTrace).toHaveBeenCalled();
  });

  it('#onMouseRelease devrait mettre drawingInProgress false', () => {
    service.onMouseRelease();
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  it('#onMouseRelease devrait appeler unsubscribe', () => {
    spyOn(service.intervalSubscription, 'unsubscribe');
    service.onMouseRelease();
    expect(service.intervalSubscription.unsubscribe).toHaveBeenCalled();
  });

  // TESTS resetTrace

  it('#resetTrace devrait réinitialiser service.trace', () => {
    service.trace.isSelected = true; // Par défaut devrait être à faux
    service.resetTrace();
    expect(service.trace.isSelected).toBe(false);
  });

  it('#resetTrace devrait attribuer la couleur principale dans colorParameter à celle trace', () => {
    service.trace.primaryColor.RGBAString = 'rgba(0, 1, 1, 0)';
    service.resetTrace();
    expect(service.trace.primaryColor).toEqual(service['colorParameter'].primaryColor);
  });

  it('#resetTrace devrait appeler la fonction updateParameters', () => {
    const test = spyOn(SprayService.prototype, 'updateParameters');
    service.resetTrace();
    expect(test).toHaveBeenCalledWith(service['tools'].activeTool);
  });

  // TESTS onInterval

  it('#onInterval devrait appeler la fonction addPoint', () => {
    spyOn(service.trace, 'addPoint');
    service.onInterval();
    expect(service.trace.addPoint).toHaveBeenCalledWith(service.mousePosition);
  });

  it('#onInterval devrait appeler la fonction setOngoingSVG', () => {
    spyOn(service['stockageSVG'], 'setOngoingSVG');
    service.onInterval();
    expect(service['stockageSVG'].setOngoingSVG).toHaveBeenCalledWith(service.trace);
  });
});
