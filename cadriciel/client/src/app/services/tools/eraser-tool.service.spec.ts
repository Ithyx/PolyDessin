import { TestBed } from '@angular/core/testing';

import { RemoveSVGService } from '../command/remove-svg.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { DEFAULT_THICKNESS, EraserToolService } from './eraser-tool.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('EraserToolService', () => {
  let service: EraserToolService;
  let isInEraserSpy: jasmine.Spy<() => void>;
  const element: DrawElement = {
    svg: '',
    svgHtml: '',
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  };
  const elementArray: DrawElement[] = [
    element, element, element
  ];

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(EraserToolService);
    service['drawing'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['thickness'] = 10;
    service['initialPoint'] = {x: 50, y: 50};
    isInEraserSpy = spyOn(service, 'isInEraser').and.callFake(() => { return; });
    elementArray.forEach((el) => {
      el.erasingEvidence = false;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS makeSquare

  it('#makeSquare devrait appeler setOngoingSVG de svgStockage avec l\'efface', () => {
    const spy = spyOn(service['svgStockage'], 'setOngoingSVG');
    service.makeSquare();
    const eraser = new RectangleService();
    eraser.svg =
      '<rect class="eraser" x="50" y="50" width="10" height="10" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"></rect>';
    eraser.svgHtml = service['sanitizer'].bypassSecurityTrustHtml(eraser.svg);
    expect(spy).toHaveBeenCalledWith(eraser);
  });

  // TESTS isInEraser
  it('#isInEraser devrait appeler la fonction findDrawElements', () => {
    isInEraserSpy.and.callThrough();
    const spy = spyOn(service, 'findDrawElements');
    service.isInEraser();
    expect(spy).toHaveBeenCalled();
  });
  it('#isInEraser devrait appeler la fonction #removeElements si l\'utilisateur est en mode brosse', () => {
    isInEraserSpy.and.callThrough();
    const spy = spyOn(service, 'removeElements');
    service['commands'].drawingInProgress = true;
    service.isInEraser();
    expect(spy).toHaveBeenCalled();
  });
  it('#isInEraser ne devrait pas appeler la fonction #removeElements si l\'utilisateur n\'est pas en mode brosse', () => {
    isInEraserSpy.and.callThrough();
    const spy = spyOn(service, 'removeElements');
    service['commands'].drawingInProgress = false;
    service.isInEraser();
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS findDrawElements
  it('#findDrawElements devrait appeler canvas.getElementsInArea avec les bons paramètres', () => {
    const spy = spyOn(service['canvas'], 'getElementsInArea');
    service.findDrawElements();
    expect(spy).toHaveBeenCalledWith(service['initialPoint'].x, service['initialPoint'].y, service['thickness'], service['thickness']);
  });
  it('#findDrawElements ne devrait metter à jour aucun élément si son stockage est vide', () => {
    service['svgStockage'].cleanDrawing();
    const spy = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    service.findDrawElements();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#findDrawElements devrait mettre en rouge tous les éléments trouvés', () => {
    spyOn(service['svgStockage'], 'getCompleteSVG').and.returnValue(elementArray);
    spyOn(Array.prototype, 'includes').and.returnValue(true);
    service.findDrawElements();
    expect(elementArray.forEach((el) => {
      expect(el.erasingEvidence).toBe(true);
    })).toBeUndefined();
  });
  it('#findDrawElements devrait appeler #adaptRedEvidence pour tous les éléments trouvés', () => {
    spyOn(service['svgStockage'], 'getCompleteSVG').and.returnValue(elementArray);
    spyOn(Array.prototype, 'includes').and.returnValue(true);
    const spy = spyOn(service, 'adaptRedEvidence');
    service.findDrawElements();
    expect(spy).toHaveBeenCalledTimes(3);
  });
  it('#findDrawElements devrait appeler sanitizer.bypassSecurityTrustHtml, même si les éléments ne sont pas concernés', () => {
    spyOn(service['svgStockage'], 'getCompleteSVG').and.returnValue(elementArray);
    spyOn(Array.prototype, 'includes').and.returnValue(false);
    const spy = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    service.findDrawElements();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  // TESTS onMouseMove
  it('#onMouseMove devrait mettre à jour l\'épaisseur du trait si une valeur est entrée', () => {
    service['thickness'] = 18;
    service['tools'].activeTool.parameters[0].value = 5;
    service.onMouseMove(new MouseEvent('move'));
    expect(service['thickness']).toBe(5);
  });
  it('#onMouseMove devrait s\'ajuster à l\'épaisseur par défault si la valeur n\'est pas définie', () => {
    service['thickness'] = 18;
    service['tools'].activeTool.parameters[0].value = undefined;
    service.onMouseMove(new MouseEvent('move'));
    expect(service['thickness']).toBe(DEFAULT_THICKNESS);
  });
  it('#onMouseMove devrait mettre à jour le point initial', () => {
    service['initialPoint'] = {x: 0, y: 0};
    const event = new MouseEvent('move', {clientX: 1005, clientY: 1005});
    service.onMouseMove(event);
    expect(service['initialPoint']).toEqual({x: 1000, y: 1000});
  });
  it('#onMouseMove devrait appeller #makeSquare', () => {
    const event = new MouseEvent('move', {clientX: 1000, clientY: 1000});
    const spy = spyOn(service, 'makeSquare');
    service.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });
  it('#onMouseMove devrait appeller #isInEraser', () => {
    service.onMouseMove(new MouseEvent('mouve'));
    expect(isInEraserSpy).toHaveBeenCalled();
  });

  // TESTS onMousePress
  it('#onMousePress devrait créer une nouvelle commande RemoveSVGService', () => {
    service.onMousePress();
    expect(service['removeCommand']).toEqual(new RemoveSVGService(service['svgStockage']));
  });

  it('#onMousePress devrait créer une nouvelle commande RemoveSVGService', () => {
    service.onMousePress();
    expect(service['commands'].drawingInProgress).toEqual(true);
  });

  // TESTS onMouseClick
  it('#onMouseClick devrait appeller onMouseMove avec les bons paramètres', () => {
    const spy = spyOn(service, 'onMouseMove');
    const event = new MouseEvent('click');
    service.onMouseClick(event);
    expect(spy).toHaveBeenCalledWith(event);
  });
  it('#onMouseClick devrait appeller commands.execute si la commande n\'est pas vide', () => {
    spyOn(RemoveSVGService.prototype, 'isEmpty').and.callFake(() => false);
    const spy = spyOn(service['commands'], 'execute');
    service.onMouseClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalledWith(service['removeCommand']);
  });
  it('#onMouseClick devrait appeller commands.execute si la commande n\'est pas vide', () => {
    spyOn(RemoveSVGService.prototype, 'isEmpty').and.callFake(() => true);
    const spy = spyOn(service['commands'], 'execute');
    service.onMouseClick(new MouseEvent('click'));
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS onMouseRelease
  it('#onMouseRelease devrait appeler command.execute si sa commande est vide', () => {
    spyOn(service['removeCommand'], 'isEmpty').and.returnValue(false);
    const spy = spyOn(service['commands'], 'execute');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalled();
  });
  it('#onMouseRelease ne devrait pas appeler command.execute si sa commande n\'est pas vide', () => {
    spyOn(service['removeCommand'], 'isEmpty').and.returnValue(true);
    const spy = spyOn(service['commands'], 'execute');
    service.onMouseRelease();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#onMouseRelease devrait recréer la commande de supression à partir du stockage', () => {
    service.onMouseRelease();
    expect(service['removeCommand']).toEqual(new RemoveSVGService(service['svgStockage']));
  });
  it('#onMouseRelease devrait mettre l\'attribut drawingInProgress à false', () => {
    service['commands'].drawingInProgress = true;
    service.onMouseRelease();
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  // TEST onMouseLeave
  it('#onMouseLeave devrait appeler la méthode clear()', () => {
    spyOn(service, 'clear');
    service.onMouseLeave();
    expect(service.clear).toHaveBeenCalled();
  });

  // TEST updateErasingColor
  it('#updateErasingColor devrait mettre à jours le RGBAString de \'element avec une opacité de 1', () => {
    element.erasingColor = {RGBA: [49, 71, 102, 0], RGBAString: ''};
    service.updateErasingColor(element);
    expect(element.erasingColor.RGBAString).toEqual('rgba(49, 71, 102, 1)');
  });
});
