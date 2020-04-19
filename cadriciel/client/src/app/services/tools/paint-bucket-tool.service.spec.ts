import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from '../canvas-conversion.service';
import { AddSVGService } from '../command/add-svg.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PaintBucketToolService } from './paint-bucket-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('PaintBucketToolService', () => {
  let service: PaintBucketToolService;
  let element: ColorFillService;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let data: Uint8ClampedArray;

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
    data = imageData.data;
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

  it('#createCanvas ne devrait rien faire si le dessin n\'est pas défini', () => {
    delete service.drawing;
    service['image'].src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service['image'].src).toEqual('http://localhost:9876/test');
  });

  it('#createCanvas ne devrait rien faire si le contexte n\'est pas défini', () => {
    spyOn(canvas, 'getContext').and.callFake(() => null);
    service['image'].src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service['image'].src).toEqual('http://localhost:9876/test');
  });

  it('#createCanvas devrait assigner à context', () => {
    delete service['context'];
    service.createCanvas();
    expect(service['context']).toEqual(context);
  });

  it('#createCanvas devrait charger la fonction onImageLoad dans l\'image', () => {
    service.createCanvas();
    expect(JSON.stringify(service['image'].onload)).toEqual(JSON.stringify(service.onImageLoad));
  });

  it('#createCanvas devrait charger l\'URL de l\'image du SVG dans le src de l\'image', () => {
    service['image'].src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service['image'].src).not.toEqual('http://localhost:9876/test');
  });

  // TESTS onImageLoad

  it('#onImageLoad devrait appeler la fonction drawImage', () => {
    const spy = spyOn(service['context'], 'drawImage').and.callThrough();
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith(service['image'], 0, 0);
  });

  it('#onImageLoad devrait appeler la fonction getImageData de context pour obtenir les couleurs du dessin au complet', () => {
    service.onImageLoad();
    expect(service['context'].getImageData).toHaveBeenCalledWith(0, 0, svgElementStub.clientWidth, svgElementStub.clientHeight);
  });

  it('#onImageLoad devrait mettre le résultat de getImageData dans l\'attribut pixelData', () => {
    service.onImageLoad();
    expect(service['pixelData']).toEqual(data);
  });

  it('#onImageLoad devrait appeler getIndex avec le mousePosition', () => {
    service['mousePosition'] = {x: 35, y: 25};
    const spy = spyOn(service, 'getIndex');
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith({x: 35, y: 25});
  });

  it('#onImageLoad devrait assigner les valeurs correspondantes dans pixelData à l\'attribut color', () => {
    spyOn(service, 'getIndex').and.returnValue(8);
    service.onImageLoad();
    expect(service['color']).toEqual([9, 0, 0]);
  });

  it('#onImageLoad ne devrait rien faire si color est identique à primaryColor de colorParameter', () => {
    spyOn(service, 'getIndex').and.returnValue(8);
    service['colorParameter'].primaryColor.RGBA = [9, 0, 0, 1];
    const spy = spyOn(service, 'fillWithColor');
    service.onImageLoad();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onImageLoad devrait appeler fillWithColor si color est différent de primaryColor en R', () => {
    spyOn(service, 'getIndex').and.returnValue(8);
    service['colorParameter'].primaryColor.RGBA = [1, 0, 0, 1];
    const spy = spyOn(service, 'fillWithColor');
    service.onImageLoad();
    expect(spy).toHaveBeenCalled();
  });

  it('#onImageLoad devrait appeler fillWithColor si color est différent de primaryColor en G', () => {
    spyOn(service, 'getIndex').and.returnValue(8);
    service['colorParameter'].primaryColor.RGBA = [9, 1, 0, 1];
    const spy = spyOn(service, 'fillWithColor');
    service.onImageLoad();
    expect(spy).toHaveBeenCalled();
  });

  it('#onImageLoad devrait appeler fillWithColor si color est différent de primaryColor en B', () => {
    spyOn(service, 'getIndex').and.returnValue(8);
    service['colorParameter'].primaryColor.RGBA = [9, 0, 1, 1];
    const spy = spyOn(service, 'fillWithColor');
    service.onImageLoad();
    expect(spy).toHaveBeenCalled();
  });

  it('#onImageLoad devrait appeler draw de fill si le nombre de points est supérieur à 0', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service['fill'].points = [{x: 0, y: 0}];
    const spy = spyOn(service['fill'], 'draw');
    service.onImageLoad();
    expect(spy).toHaveBeenCalled();
  });

  it('#onImageLoad devrait appeler execute de commands avec le fill si le nombre de points est supérieur à 0', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service['fill'].points = [{x: 0, y: 0}];
    const spy = spyOn(service['commands'], 'execute');
    service.onImageLoad();
    const command = new AddSVGService([service['fill']], TestBed.get(SVGStockageService));
    expect(spy).toHaveBeenCalledWith(command);
  });

  it('#onImageLoad ne devrait pas appeler draw de fill si le nombre de points est 0', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service['fill'].points = [];
    const spy = spyOn(service['fill'], 'draw');
    service.onImageLoad();
    expect(spy).not.toHaveBeenCalled();
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
