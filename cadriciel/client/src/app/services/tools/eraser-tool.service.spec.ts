import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from '../canvas-conversion/canvas-conversion.service';
import { RemoveSVGService } from '../command/remove-svg.service';
import { RectangleService } from '../stockage-svg/draw-element/basic-shape/rectangle.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
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
    trueType: 0,
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updateRotation: () => { return; },
    updateScale: () => { return; },
    calculateRotation: () => { return; },
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
    updateParameters: () => { return; }
  };
  const elementArray: DrawElement[] = [
    element, element, element
  ];

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }, getElementsInArea: () => []}}]
  }));
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

  // TESTS updateElement
  it('#updateElement devrait mettre l\'attribut erasingEvidence à false', () => {
    element.erasingEvidence = true;
    service.updateElement(element);
    expect(element.erasingEvidence).toBe(false);
    element.erasingEvidence = false;
  });
  it('#updateElement devrait mettre à jour le svg de l\'élément', () => {
    const spy = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    const svgCopy = element.svg;
    service.updateElement(element);
    expect(spy).toHaveBeenCalledWith(svgCopy);
  });

  // TESTS removeElements
  it('#removeElements ne devrait pas changer le svg d\'aucun élément si son attribut selectedDrawElement est vide', () => {
    const spy = spyOn(service, 'updateElement');
    service['selectedDrawElement'] = [];
    service.removeElements();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#removeElements devrait changer le svg de chacun des éléments de son attribut selectedDrawElement', () => {
    const spy = spyOn(service, 'updateElement');
    service['selectedDrawElement'] = [element, element, element, element];
    service.removeElements();
    expect(spy).toHaveBeenCalledTimes(4);
  });
  it('#removeElements ne devrait pas mettre à jour le dessin si la sélection est vide', () => {
    const spy = spyOn(service['canvas'], 'updateDrawing');
    service['selectedDrawElement'] = [];
    service.removeElements();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#removeElements devrait remettre les éléments sélectionés à 0', () => {
    service['selectedDrawElement'] = [element, element, element, element];
    service.removeElements();
    expect(service['selectedDrawElement']).toEqual([]);
  });

  // TESTS clear
  it('#clear ne devrait changer le svg d\'aucun élément si le dessin est vide', () => {
    const spy = spyOn(service, 'updateElement');
    spyOn(service['svgStockage'], 'getCompleteSVG').and.returnValue([]);
    service.clear();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#clear devrait changer le svg de chacun des éléments du dessin si drawingInProgress est vrai', () => {
    service['commands'].drawingInProgress = true;
    const spy = spyOn(service, 'updateElement');
    spyOn(service['svgStockage'], 'getCompleteSVG').and.returnValue([element, element, element, element]);
    service.clear();
    expect(spy).toHaveBeenCalledTimes(4);
  });
  it('#clear devrait mettre drawingInProgress à false', () => {
    service['commands'].drawingInProgress = true;
    service.clear();
    expect(service['commands'].drawingInProgress).toBe(false);
  });
  it('#clear devrait exécuter la commande si elle n\'est pas vide et que drawingInProgress est vrai', () => {
    service['commands'].drawingInProgress = true;
    spyOn(service['removeCommand'], 'isEmpty').and.returnValue(false);
    const spy = spyOn(service['commands'], 'execute');
    const commandCopy = service['removeCommand'];
    service.clear();
    expect(spy).toHaveBeenCalledWith(commandCopy);
  });
  it('#clear ne devrait pas exécuter la commande si elle est vide et que drawingInProgress est vrai', () => {
    service['commands'].drawingInProgress = true;
    spyOn(service['removeCommand'], 'isEmpty').and.returnValue(true);
    const spy = spyOn(service['commands'], 'execute');
    service.clear();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#clear ne devrait pas exécuter la commande si drawingInProgress est faux', () => {
    service['commands'].drawingInProgress = false;
    spyOn(service['removeCommand'], 'isEmpty').and.returnValue(false);
    const spy = spyOn(service['commands'], 'execute');
    service.clear();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#clear devrait créer une nouvelle RemoveCommand', () => {
    service.clear();
    expect(service['removeCommand']).toEqual(new RemoveSVGService(service['svgStockage']));
  });
  it('#clear devrait créer appeler setOngoingSVG avec les bons paramètres', () => {
    const spy = spyOn(service['svgStockage'], 'setOngoingSVG');
    service.clear();
    expect(spy).toHaveBeenCalledWith(new RectangleService());
  });
  it('#clear devrait remettre les éléments sélectionnés à 0', () => {
    service['selectedDrawElement'] = [element, element, element, element];
    service.clear();
    expect(service['selectedDrawElement']).toEqual([]);
  });

  // TESTS shouldBeDarkRed
  it('#shouldBeDarkRed devrait renvoyer true si l\'élément à une couleur secondaire suffisamment rouge', () => {
    const colorBackup = element.secondaryColor;
    element.secondaryColor =  {RGBAString: '', RGBA: [250, 100, 100, 1]};
    expect(service.shouldBeDarkRed(element)).toBe(true);
    element.secondaryColor = colorBackup;
  });
  it('#shouldBeDarkRed devrait renvoyer true si l\'élément à une couleur primaire suffisamment rouge sans couleur secondaire', () => {
    const primaryColorBackup = element.primaryColor;
    const secondaryColorBackup = element.secondaryColor;
    element.secondaryColor = undefined;
    element.primaryColor =  {RGBAString: '', RGBA: [250, 100, 100, 1]};
    expect(service.shouldBeDarkRed(element)).toBe(true);
    element.primaryColor = primaryColorBackup;
    element.secondaryColor = secondaryColorBackup;
  });
  it('#shouldBeDarkRed devrait renvoyer false si l\'élément à une couleur secondaire non rouge', () => {
    const colorBackup = element.secondaryColor;
    element.secondaryColor =  {RGBAString: '', RGBA: [200, 100, 100, 1]};
    expect(service.shouldBeDarkRed(element)).toBe(false);
    element.secondaryColor = colorBackup;
  });
  it('#shouldBeDarkRed devrait renvoyer true si l\'élément à une couleur primaire non rouge sans couleur secondaire', () => {
    const primaryColorBackup = element.primaryColor;
    const secondaryColorBackup = element.secondaryColor;
    element.secondaryColor = undefined;
    element.primaryColor =  {RGBAString: '', RGBA: [200, 100, 100, 1]};
    expect(service.shouldBeDarkRed(element)).toBe(false);
    element.primaryColor = primaryColorBackup;
    element.secondaryColor = secondaryColorBackup;
  });

  // TESTS adaptRedEvidence
  it('#adaptRedEvidence devrait mettre le la couleur à rouge si l\'élément ne l\'est pas déjà', () => {
    const backup = element.erasingEvidence;
    spyOn(service, 'shouldBeDarkRed').and.returnValue(false);
    service.adaptRedEvidence(element);
    expect(element.erasingColor.RGBA).toEqual([255, 0, 0, 1]);
    element.erasingEvidence = backup;
  });
  it('#adaptRedEvidence devrait mettre le la couleur à rouge foncé si l\'élément ne est suffisamment rouge', () => {
    const backup = element.erasingEvidence;
    spyOn(service, 'shouldBeDarkRed').and.returnValue(true);
    service.adaptRedEvidence(element);
    expect(element.erasingColor.RGBA).toEqual([170, 0, 0, 1]);
    element.erasingEvidence = backup;
  });
  it('#adaptRedEvidence devrait mettre à jour le string de la couleur peu importe son niveau de rouge', () => {
    const backup = element.erasingEvidence;
    const spy = spyOn(service, 'updateErasingColor');
    const shouldBeRedSpy = spyOn(service, 'shouldBeDarkRed').and.returnValue(false);
    service.adaptRedEvidence(element);
    expect(spy).toHaveBeenCalled();
    spy.calls.reset();
    shouldBeRedSpy.and.returnValue(true);
    service.adaptRedEvidence(element);
    expect(spy).toHaveBeenCalled();
    element.erasingEvidence = backup;
  });

  // TEST updateErasingColor
  it('#updateErasingColor devrait mettre à jours le RGBAString de \'element avec une opacité de 1', () => {
    element.erasingColor = {RGBA: [49, 71, 102, 0], RGBAString: ''};
    service.updateErasingColor(element);
    expect(element.erasingColor.RGBAString).toEqual('rgba(49, 71, 102, 1)');
  });
});
