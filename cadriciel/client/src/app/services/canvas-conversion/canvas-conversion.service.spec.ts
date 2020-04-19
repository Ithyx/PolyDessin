import { TestBed } from '@angular/core/testing';

import { DomSanitizer } from '@angular/platform-browser';
import { Color } from '../color/color';
import { RectangleService } from '../stockage-svg/draw-element/basic-shape/rectangle.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SprayService } from '../stockage-svg/draw-element/spray.service';
import { TraceBrushService } from '../stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { CanvasConversionService, COLOR_INCREASE_LINE, COLOR_INCREASE_SPRAY } from './canvas-conversion.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

let firstElement: DrawElement;
let secondElement: DrawElement;
let thirdElement: DrawElement;

describe('CanvasConversionService', () => {
  let service: CanvasConversionService;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let stockage: SVGStockageService;
  let sanitizer: DomSanitizer;
  let completeElements: DrawElement[];

  const firstColor: Color = {
    RGBAString: 'rgba(1, 0, 0, 1)',
    RGBA: [1, 0, 0, 1]
  };
  const secondColor: Color = {
      RGBAString: 'rgba(2, 0, 0, 1)',
      RGBA: [2, 0, 0, 1]
  };
  const thirdColor: Color = {
    RGBAString: 'rgba(3, 0, 0, 1)',
    RGBA: [3, 0, 0, 1]
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(CanvasConversionService);
    stockage = TestBed.get(SVGStockageService);
    sanitizer = TestBed.get(DomSanitizer);
    service['svgStockage'] = stockage;
    service.coloredDrawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas = document.createElement('canvas');
    service.canvas = canvas;
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
      service['context'] = context;
    }
    service['image'] = new Image();
    service['isValid'] = true;

    firstElement = new TracePencilService();
    firstElement.points = [{x: 0, y: 0}, {x: 1, y: 2}, {x: 0, y: 3}];
    firstElement.draw();

    secondElement = new RectangleService();
    secondElement.points = [{x: 3, y: 7}, {x: 2, y: 5}];
    secondElement.draw();

    thirdElement = new TraceBrushService();
    thirdElement.points = [{x: 0, y: 0}, {x: 1, y: 1}];
    thirdElement.draw();

    completeElements = [firstElement, secondElement, thirdElement];
    spyOn(stockage, 'getCompleteSVG').and.callFake(() => completeElements);

    const imageData = new ImageData(2, 2);
    const data = imageData.data;
    data.set([
      1, 0, 0, 1,
      1, 0, 0, 1,
      9, 0, 0, 1,
      3, 0, 2, 1
    ]);
    spyOn(context, 'getImageData').and.callFake(() => imageData);
    service['coloredElements'].set(firstColor.RGBAString, firstElement);
  });

  beforeAll(() => {
    jasmine.clock().install();
  });

  afterAll(() => {
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS convertToCanvas

  it('#convertToCanvas ne devrait rien faire si le canvas n\'est pas défini', () => {
    delete service.canvas;
    const spy = spyOn(HTMLCanvasElement.prototype, 'getContext');
    service.convertToCanvas();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#convertToCanvas devrait appeler getContext("2d") pour obtenir le contexte du canvas', () => {
    spyOn(service.canvas, 'getContext');
    service.convertToCanvas();
    expect(service.canvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('#convertToCanvas ne devrait rien faire si le contexte n\'est pas défini', () => {
    delete service['context'];
    spyOn(service.canvas, 'getContext').and.callFake(() => null);
    service.convertToCanvas();
    expect(service['context']).not.toBeDefined();
  });

  it('#convertToCanvas ne devrait rien faire si coloredDrawing n\'est pas défini', () => {
    delete service['context'];
    delete service.coloredDrawing;
    service.convertToCanvas();
    expect(service['context']).not.toBeDefined();
  });

  it('#convertToCanvas devrait garder le contexte en mémoire s\'il est défini', () => {
    service.convertToCanvas();
    expect(service['context']).toEqual(context);
  });

  it('#convertToCanvas devrait appeler serializeToString sur coloredDrawing', () => {
    const spy = spyOn(XMLSerializer.prototype, 'serializeToString');
    service.convertToCanvas();
    expect(spy).toHaveBeenCalledWith(service.coloredDrawing);
  });

  it('#convertToCanvas devrait charger la fonction loadImage dans l\'image', () => {
    service.convertToCanvas();
    expect(JSON.stringify(service['image'].onload)).toEqual(JSON.stringify(service.loadImage));
  });

  it('#convertToCanvas devrait générer l\'URL de l\'image du SVG', () => {
    spyOn(URL, 'createObjectURL');
    service.convertToCanvas();
    expect(URL.createObjectURL).toHaveBeenCalledWith(
      new Blob([new XMLSerializer().serializeToString(service.coloredDrawing)], {type: 'image/svg+xml;charset=utf-8'})
    );
  });

  it('#convertToCanvas devrait charger l\'URL de l\'image du SVG dans le src de l\'image', () => {
    spyOn(URL, 'createObjectURL').and.callFake(() => 'http://localhost:9876/fakeURL');
    service.convertToCanvas();
    expect(service['image'].src).toEqual('http://localhost:9876/fakeURL');
  });

  // TEST loadImage

  it('#loadImage devrait appeler drawImage du contexte avec l\'image en paramètre', () => {
    spyOn(context, 'drawImage');
    service.loadImage();
    expect(context.drawImage).toHaveBeenCalledWith(service['image'], 0, 0);
  });

  // TESTS updateDrawing

  it('#updateDrawing devrait mettre isValid à false', () => {
    service.updateDrawing();
    expect(service['isValid']).toBe(false);
  });

  it('#updateDrawing devrait appeler getCompleteSVG de SVGStockage', () => {
    service.updateDrawing();
    expect(stockage.getCompleteSVG).toHaveBeenCalled();
  });

  it('#updateDrawing devrait appeler calculateColor avec tous les éléments et le tableau rgb', () => {
    const spy = spyOn(service, 'calculateColor').and.returnValue({RGBA: [1, 0, 0, 1], RGBAString: 'rgba(1, 0, 0, 1)'});
    service.updateDrawing();
    expect(spy).toHaveBeenCalledWith(firstElement);
    expect(spy).toHaveBeenCalledWith(secondElement);
    expect(spy).toHaveBeenCalledWith(thirdElement);
  });

  it('#updateDrawing devrait appeler createClone sur tous les elements', () => {
    const spy = spyOn(service, 'createClone');
    service.updateDrawing();
    expect(spy).toHaveBeenCalledWith(firstElement);
    expect(spy).toHaveBeenCalledWith(secondElement);
    expect(spy).toHaveBeenCalledWith(thirdElement);
  });

  it('#updateDrawing devrait ajouter un clone de chaque élément avec des couleurs modifiées dans drawing.elements', () => {
    service.updateDrawing();

    firstElement.primaryColor = firstColor;
    const coloredFirstElement = service['savingUtility'].createCopyDrawElement(firstElement);
    firstElement.draw();
    coloredFirstElement.svgHtml = sanitizer.bypassSecurityTrustHtml(firstElement.svg);

    expect(service['drawing'].elements).toContain(coloredFirstElement);
  });

  it('#updateDrawing devrait changer la couleur secondaire de l\'élément s\'il en contient une', () => {
    service.updateDrawing();

    secondElement.primaryColor = secondColor;
    secondElement.secondaryColor = secondColor;
    const coloredSecondElement = service['savingUtility'].createCopyDrawElement(secondElement);
    secondElement.draw();
    coloredSecondElement.svgHtml = sanitizer.bypassSecurityTrustHtml(secondElement.svg);

    expect(service['drawing'].elements).toContain(coloredSecondElement);
  });

  it('#updateDrawing devrait remettre chaque élément du stockage à son état initial', () => {
    const firstInitial = JSON.stringify(firstElement);
    const secondInitial = JSON.stringify(secondElement);
    const thirdInitial = JSON.stringify(thirdElement);
    service.updateDrawing();
    expect(JSON.stringify(firstElement)).toEqual(firstInitial);
    expect(JSON.stringify(secondElement)).toEqual(secondInitial);
    expect(JSON.stringify(thirdElement)).toEqual(thirdInitial);
  });

  it('#updateDrawing devrait ajouter les éléments à coloredElements en utilisant la couleur unique comme clé', () => {
    const spy = spyOn(Map.prototype, 'set');
    service.updateDrawing();
    expect(spy).toHaveBeenCalledWith(firstColor.RGBAString, firstElement);
    expect(spy).toHaveBeenCalledWith(secondColor.RGBAString, secondElement);
    expect(spy).toHaveBeenCalledWith(thirdColor.RGBAString, thirdElement);
  });

  it('#updateDrawing devrait appeler setTimeout de window', () => {
    spyOn(window, 'setTimeout');
    service.updateDrawing();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  it('#updateDrawing devrait appeler convertToCanvas après le délai', () => {
    spyOn(service, 'convertToCanvas');
    service.updateDrawing();
    jasmine.clock().tick(5);
    expect(service.convertToCanvas).toHaveBeenCalled();
  });

  // TESTS calculateColor

  it('#calculateColor devrait assigner des teintes de rouge aux premiers SVG du stockage', () => {
    service['elementRGB'] = [0, 0, 0];
    expect(service.calculateColor(firstElement).RGBA).toEqual([1, 0, 0, 1]);
  });

  it('#calculateColor devrait assigner des teintes de vert lorsque la limite de rouge est atteinte', () => {
    service['elementRGB'] = [255, 0, 0];
    expect(service.calculateColor(firstElement).RGBA).toEqual([0, 1, 0, 1]);
  });

  it('#calculateColor devrait assigner des teintes de bleu lorsque la limite de vert est atteinte', () => {
    service['elementRGB'] = [255, 255, 0];
    expect(service.calculateColor(firstElement).RGBA).toEqual([0, 0, 1, 1]);
  });

  it('#calculateColor devrait incrémenter la couleur de COLOR_INCREASE_SPRAY pour un trait d\'aérosol', () => {
    service['elementRGB'] = [0, 0, 0];
    const spray = new SprayService();
    expect(service.calculateColor(spray).RGBA).toEqual([COLOR_INCREASE_SPRAY, 0, 0, 1]);
  });

  it('#calculateColor devrait incrémenter la couleur de COLOR_INCREASE_LINE pour une ligne', () => {
    service['elementRGB'] = [0, 0, 0];
    const line = new LineService();
    expect(service.calculateColor(line).RGBA).toEqual([COLOR_INCREASE_LINE, 0, 0, 1]);
  });

  // TESTS createClone

  it('#createClone devrait appeler createCopyDrawElement de savingUtility avec l\'élément', () => {
    const spy = spyOn(service['savingUtility'], 'createCopyDrawElement').and.callThrough();
    service.createClone(firstElement);
    expect(spy).toHaveBeenCalledWith(firstElement);
  });

  it('#createClone devrait appeler draw sur l\'élément en paramètre s\'il n\'est pas un TraceBrush', () => {
    const spy = spyOn(firstElement, 'draw');
    service.createClone(firstElement);
    expect(spy).toHaveBeenCalled();
  });

  it('#createClone devrait appeler sanitize sur l\'élément en paramètre s\'il n\'est pas un TraceBrush', () => {
    spyOn(service, 'sanitize');
    service.createClone(firstElement);
    expect(service.sanitize).toHaveBeenCalledWith(firstElement.svg);
  });

  it('#createClone devrait appeler draw sur un TracePencil si l\'élément en paramètre est un TraceBrush', () => {
    const spy = spyOn(TracePencilService.prototype, 'draw');
    service.createClone(thirdElement);
    expect(spy).toHaveBeenCalled();
  });

  it('#createClone devrait appeler sanitize sur un TracePencil si l\'élément en paramètre est un TraceBrush', () => {
    spyOn(service, 'sanitize');
    service.createClone(thirdElement);
    const tracePencil = new TracePencilService();
    if (thirdElement instanceof TraceBrushService) {
      tracePencil.points = thirdElement.points;
      tracePencil.primaryColor = thirdElement.primaryColor;
      tracePencil.thickness = thirdElement.thickness;
      tracePencil.transform = {...thirdElement.transform};
      tracePencil.isAPoint = thirdElement.isAPoint;
      tracePencil.draw();
    }
    expect(service.sanitize).toHaveBeenCalledWith(tracePencil.svg);
  });

  it('#createClone devrait retourner un clone de l\'élément en paramètre', () => {
    const element = service['savingUtility'].createCopyDrawElement(firstElement);
    firstElement.draw();
    element.svgHtml = sanitizer.bypassSecurityTrustHtml(firstElement.svg);
    expect(service.createClone(firstElement)).toEqual(element);
  });

  // TESTS getElementsInArea

  it('#getElementsInArea ne devrait rien faire si isValid est false', () => {
    service['isValid'] = false;
    service.getElementsInArea(1, 1, 1, 1);
    expect(context.getImageData).not.toHaveBeenCalled();
  });

  it('#getElementsInArea devrait appeler getColorOccurrences', () => {
    const spy = spyOn(service, 'getColorOccurrences').and.returnValue(new Map<string, number>());
    service.getElementsInArea(1, 1, 1, 1);
    expect(spy).toHaveBeenCalledWith(1, 1, 1, 1);
  });

  it('#getElementsInArea devrait appeler canBeBlending sur tous les éléments', () => {
    const spy = spyOn(service, 'canBeBlending');
    const occurrences = new Map<string, number>();
    occurrences.set('rgba(1, 0, 0, 1)', 2);
    service.getElementsInArea(0, 0, 2, 2);
    expect(spy).toHaveBeenCalledWith(occurrences, 2, 2);
  });

  it('#getElementsInArea devrait appeler isPointInArea si canBeBlending est vrai', () => {
    spyOn(service, 'canBeBlending').and.returnValue(true);
    const spy = spyOn(service, 'isPointInArea');
    service.getElementsInArea(0, 0, 2, 2);
    expect(spy).toHaveBeenCalledWith(firstElement, 0, 0, 2, 2);
  });

  it('#getElementsInArea ne devrait rien faire si canBeBlending retourne vrai et isPointInArea retourne faux', () => {
    spyOn(service, 'canBeBlending').and.returnValue(true);
    spyOn(service, 'isPointInArea').and.returnValue(false);
    expect(service.getElementsInArea(0, 0, 2, 2)).toEqual([]);
  });

  it('#getElementsInArea devrait appeler get de coloredElements avec la couleur si canBeBlending retourne faux', () => {
    spyOn(service, 'canBeBlending').and.returnValue(false);
    const spy = spyOn(service['coloredElements'], 'get');
    service.getElementsInArea(0, 0, 2, 2);
    expect(spy).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
  });

  it('#getElementsInArea devrait appeler get de coloredElements avec la couleur si canBeBlending retourne vrai '
    + 'et isPointInArea retourne vrai', () => {
    spyOn(service, 'canBeBlending').and.returnValue(true);
    spyOn(service, 'isPointInArea').and.returnValue(true);
    const spy = spyOn(service['coloredElements'], 'get');
    service.getElementsInArea(0, 0, 2, 2);
    expect(spy).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
  });

  it('#getElementsInArea ne devrait pas ajouter d\'élément qui n\'est pas contenu dans coloredElements', () => {
    spyOn(service, 'canBeBlending').and.returnValue(false);
    service['coloredElements'] = new Map<string, DrawElement>();
    expect(service.getElementsInArea(0, 0, 2, 2)).toEqual([]);
  });

  it('#getElementsInArea devrait ajouter les éléments qu\'il trouve dans la valeur de retour', () => {
    spyOn(service, 'canBeBlending').and.returnValue(false);
    service['coloredElements'].set('rgba(3, 0, 2, 1)', thirdElement).set('rgba(9, 0, 0, 1)', secondElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toContain(secondElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toContain(thirdElement);
  });

  it('#getElementsInArea ne devrait pas ajouter plusieurs fois le même élément dans la valeur de retour', () => {
    spyOn(service, 'canBeBlending').and.returnValue(false);
    service['coloredElements'].set('rgba(1, 0, 0, 1)', firstElement);
    expect(service.getElementsInArea(0, 0, 2, 2)).toEqual([firstElement]);
  });

  // TESTS getColorOccurrences

  it('#getColorOccurrences devrait appeler getImageData avec les coordonnées, la hauteur et la largeur en paramètres', () => {
    service.getColorOccurrences(1, 2, 15, 28);
    expect(context.getImageData).toHaveBeenCalledWith(1, 2, 15, 28);
  });

  it('#getColorOccurrences devrait appeler has sur coloredElements pour toutes les couleurs sur la surface', () => {
    spyOn(service['coloredElements'], 'has');
    service.getColorOccurrences(0, 0, 2, 2);
    expect(service['coloredElements'].has).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
    expect(service['coloredElements'].has).toHaveBeenCalledWith('rgba(1, 0, 0, 1)');
    expect(service['coloredElements'].has).toHaveBeenCalledWith('rgba(9, 0, 0, 1)');
    expect(service['coloredElements'].has).toHaveBeenCalledWith('rgba(3, 0, 2, 1)');
  });

  it('#getColorOccurrences ne devrait rien faire si has retourne faux à chaque élément', () => {
    spyOn(service['coloredElements'], 'has').and.returnValue(false);
    expect(service.getColorOccurrences(0, 0, 2, 2)).toEqual(new Map<string, number>());
  });

  it('#getColorOccurences devrait retourner les occurrences pour chaque couleur trouvée', () => {
    const occurrences = new Map<string, number>();
    occurrences.set('rgba(1, 0, 0, 1)', 2);
    expect(service.getColorOccurrences(0, 0, 2, 2)).toEqual(occurrences);
  });

  // TESTS canBeBlending

  it('#canBeBlending devrait retourner faux si une seule couleur a été trouvée', () => {
    const occurrences = new Map<string, number>();
    occurrences.set('rgba(1, 0, 0, 1)', 6);
    expect(service.canBeBlending(occurrences, 6, 42)).toBe(false);
  });

  it('#canBeBlending devrait retourner faux s\'il a plus d\'occurrences que la valeur de thickness', () => {
    const occurrences = new Map<string, number>();
    occurrences.set('rgba(1, 0, 0, 1)', 6).set('rgba(2, 0, 0, 1)', 3);
    expect(service.canBeBlending(occurrences, 6, 5)).toBe(false);
  });

  it('#canBeBlending devrait retourner vrai si ce n\'est pas le seul élément et qu\'il a peu d\'occurrences', () => {
    const occurrences = new Map<string, number>();
    occurrences.set('rgba(1, 0, 0, 1)', 3).set('rgba(2, 0, 0, 1)', 3);
    expect(service.canBeBlending(occurrences, 3, 5)).toBe(true);
  });

  // TESTS isPointInArea

  it('#isPointInArea devrait retourner faux si l\'élément n\'est pas défini', () => {
    expect(service.isPointInArea(undefined, 0, 0, 0, 0)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si l\'élément n\'est pas un point', () => {
    const element = new TracePencilService();
    element.isAPoint = false;
    expect(service.isPointInArea(element, 0, 0, 0, 0)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si l\'élément n\'a pas de thickness', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    delete element.thickness;
    expect(service.isPointInArea(element, 0, 0, 0, 0)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si le point maximal en x de l\'élément '
    + 'est inférieur au point minimal en x de la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 0, y: 15};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si le point minimal en x de l\'élément '
    + 'est supérieur au point maximal en x de la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 30, y: 15};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si le point maximal en y de l\'élément '
    + 'est inférieur au point minimal en y de la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 15, y: 0};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si le point minimal en y de l\'élément '
    + 'est supérieur au point maximal en y de la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 15, y: 30};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(false);
  });

  it('#isPointInArea devrait retourner faux si le point maximal en x de l\'élément '
    + 'est inférieur au point minimal en x de la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 0, y: 15};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(false);
  });

  it('#isPointInArea devrait retourner vrai si le point se trouve dans la surface', () => {
    const element = new TracePencilService();
    element.isAPoint = true;
    element.thickness = 5;
    element.points[0] = {x: 15, y: 15};
    expect(service.isPointInArea(element, 10, 10, 10, 10)).toBe(true);
  });

  // TEST sanitize

  it('#sanitize devrait retourner la valeur en SafeHtml du string passé en paramètre', () => {
    const testString = '<test />';
    expect(service.sanitize(testString)).toEqual(sanitizer.bypassSecurityTrustHtml(testString));
  });
});
