import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from '../canvas-conversion.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { PaintBucketToolService } from './paint-bucket-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('PaintBucketToolService', () => {
  let service: PaintBucketToolService;
  let element: ColorFillService;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  const svgElementStub: Partial<SVGElement> = {
    clientHeight: 500,
    clientWidth: 1000
  };

  const fakeSVGString = '<svg xmlns="http://www.w3.org/2000/svg" class="drawing" version="1.1" width="1623" height="1026"></svg>';

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: CanvasConversionService, useValue: { updateDrawing: () => { return; }}},
                {provide: SVGElement, useValue: svgElementStub}]
  }));

  beforeEach(() => {
    canvas = document.createElement('canvas');
    service = TestBed.get(PaintBucketToolService);
    service['colorParameter'].primaryColor.RGBAString = 'primary';
    service['colorParameter'].secondaryColor.RGBAString = 'secondary';
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
      service['context'] = context;
    }
    service['mousePosition'] = {x: 5, y: 5};
    service['image'] = new Image();
    service.drawing = TestBed.get(SVGElement);
    service.canvas = canvas;
    element = new ColorFillService();
    const imageData = new ImageData(2, 2);
    const data = imageData.data;
    data.set([
      1, 0, 0, 1,
      1, 0, 0, 1,
      9, 0, 0, 1,
      3, 0, 2, 1
    ]);
    spyOn(context, 'getImageData').and.returnValue(imageData);
    spyOn(XMLSerializer.prototype, 'serializeToString').and.callFake((root: SVGElement) => fakeSVGString);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS onMouseClick

  it('#onMouseClick devrait ajouter la position de la souris à mousePosition', () => {
    service['mousePosition'] = {x: 10, y: 10};
    service.onMouseClick(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service['mousePosition']).toEqual({x: 100, y: 100});
  });

  it('#onMouseClick devrait mettre fill.points[] vide', () => {
    service['fill'].points.push({x: 10, y: 10});
    service.onMouseClick(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service['fill'].points).toEqual([]);
  });

  it('#onMouseClick devrait assigner à primaryColor', () => {
    service['colorParameter'].primaryColor = element.primaryColor;
    service['fill'].primaryColor = {
      RGBAString: 'rgba(1, 1, 1, 1)',
      RGBA: [1, 1, 1, 1]
    };

    service.onMouseClick(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service['fill'].primaryColor).toEqual(service['colorParameter'].primaryColor);
  });

  it('#onMouseClick devrait réinitialiser checkedPixels', () => {
    service['checkedPixels'].set(10, [10]);
    service.onMouseClick(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service['checkedPixels']).toEqual(new Map<number, number[]>());
  });

  it('#onMouseClick devrait appeler la fonction createCanvas', () => {
    const spy = spyOn(service, 'createCanvas');
    service.onMouseClick(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(spy).toHaveBeenCalled();
  });

  // TESTS createCanvas

  it('#createCanvas devrait appeler la fonction getContext', () => {
    const spy = spyOn(service.canvas, 'getContext');
    service.createCanvas();
    expect(spy).toHaveBeenCalledWith('2d');
  });

  it('#createCanvas devrait assigner à context', () => {
    delete service['context'];
    service.createCanvas();
    expect(service['context']).toEqual(context);
  });

  // TESTS onImageLoad

  it('#onImageLoad devrait appeler la fonction drawImage', () => {
    const spy = spyOn(service['context'], 'drawImage').and.callThrough();
    service['image'].onload = service.onImageLoad.bind(service);
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith(service['image'], 0, 0);
  });

  // TESTS fillWithColor

  /*it('#fillWithColor devrait appeler la fonction getContext', () => {
    const spy = spyOn(Array.prototype, 'push');
    service.fillWithColor();
    expect(spy).toHaveBeenCalledWith(service['mousePosition']);
  });*/

  /* it('#fillWithColor 1', () => {
    service['mousePosition'] = {x: 90, y: 90};
    spyOn(service, 'checkColor').and.returnValue(true);
    const spy = spyOn(service, 'addPixelPosition');
    service.fillWithColor();
    expect(spy).toHaveBeenCalled();
  }); */

  // TESTS findLeftBorder
  it('#findLeftBorder devrait appeler checkColor jusqu\'à que la position en x soit nulles', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    expect(service.findLeftBorder({x: 90, y: 90})).toEqual(0);
  });

  // TESTS checkAbovePixel
  // TODO : NOM DU TEST
  it('#checkAbovePixel 1', () => {
    spyOn(service, 'checkColor').and.returnValue(false);
    expect(service.checkAbovePixel({x: 5, y: 5}, true, [])).toBe(false);
  });

  // TODO : NOM DU TEST
  it('#checkAbovePixel 2', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    expect(service.checkAbovePixel({x: 5, y: 4}, false, [])).toBe(true);
  });

  // TODO : NOM DU TEST
  it('#checkAbovePixel 3', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    const spanAbove = false;
    expect(service.checkAbovePixel({x: 5, y: -4}, spanAbove, [])).toBe(spanAbove);
  });

  // TESTS checkBelowPixel

  it('#checkBelowPixel devrait renvoyer false si le pixel en dessous est d\'une couleur différente', () => {
    spyOn(service, 'checkColor').and.returnValue(false);
    expect(service.checkBelowPixel({x: 5, y: 5}, true, [])).toBe(false);
  });

  it('#checkBelowPixel devrait renvoyer true si spanBelow est à false et que la position en y est toujours dans le dessin', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    expect(service.checkBelowPixel({x: 5, y: -4}, false, [])).toBe(true);
  });

  // TODO : NOM DU TEST
  it('#checkBelowPixel 3', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    const spanBelow = false;
    expect(service.checkBelowPixel({x: 5, y: 2000}, spanBelow, [])).toBe(spanBelow);
  });

  // TESTS addPixelPosition

  it('#addPixelPosition devrait ajouter la position en y si la position en x est déjà une clé de checkedPixels', () => {
    service['checkedPixels'].set(1, [1, 2, 3]);
    service.addPixelPosition({x: 1, y: 4});
    expect(service['checkedPixels'].get(1)).toEqual([1, 2, 3, 4]);
  });

  it('#addPixelPosition devrait créer un nouvelle index dans checkedPixels si la position en x n\'est pas un clé', () => {
    service['checkedPixels'] = new Map<number, number[]>();     // map vide
    service.addPixelPosition({x: 2, y: 4});
    expect(service['checkedPixels'].get(2)).toEqual([4]);
  });

  // TESTS checkColor
    // TODO

  // TESTS getIndex

  it('#getIndex devrait créer un index unique pour une position du dessin', () => {
    const testIndex = (5 + 5 * service.drawing.clientWidth) * 4;
    expect(service.getIndex({x: 5, y: 5})).toEqual(testIndex);
  });
});
