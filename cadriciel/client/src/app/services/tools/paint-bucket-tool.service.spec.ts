import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from '../canvas-conversion/canvas-conversion.service';
import { B, G, R } from '../color/color';
import { AddSVGService } from '../command/add-svg.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PaintBucketToolService } from './paint-bucket-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count

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
    service['checkedPixels'] = new Map<number, number[]>();
    service['pixelData'] = data;
    service['tools'].activeTool.parameters[0].value = 20; // Tolérance de 20%
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
    spyOn(service, 'fillWithColor').and.returnValue();
    const spy = spyOn(service['context'], 'drawImage').and.callThrough();
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith(service['image'], 0, 0);
  });

  it('#onImageLoad devrait appeler la fonction getImageData de context pour obtenir les couleurs du dessin au complet', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service.onImageLoad();
    expect(service['context'].getImageData).toHaveBeenCalledWith(0, 0, svgElementStub.clientWidth, svgElementStub.clientHeight);
  });

  it('#onImageLoad devrait mettre le résultat de getImageData dans l\'attribut pixelData', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service.onImageLoad();
    expect(service['pixelData']).toEqual(data);
  });

  it('#onImageLoad devrait appeler getIndex avec le mousePosition', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
    service['mousePosition'] = {x: 35, y: 25};
    const spy = spyOn(service, 'getIndex');
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith({x: 35, y: 25});
  });

  it('#onImageLoad devrait assigner les valeurs correspondantes dans pixelData à l\'attribut color', () => {
    spyOn(service, 'fillWithColor').and.returnValue();
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

  it('#fillWithColor devrait appeler findLeftBorder pour tous les points dans queue', () => {
    const spy = spyOn(service, 'findLeftBorder');
    service.fillWithColor();
    expect(spy).toHaveBeenCalledWith(service['mousePosition']);
  });

  it('#fillWithColor devrait appeler checkColor pour toutes les positions en x jusqu\'à la bordure droite', () => {
    spyOn(service, 'findLeftBorder').and.returnValue(995);
    spyOn(service, 'checkAbovePixel').and.returnValue(false);
    spyOn(service, 'checkBelowPixel').and.returnValue(false);
    const spy = spyOn(service, 'checkColor').and.returnValue(true);
    service.fillWithColor();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('#fillWithColor devrait appeler checkAbovePixel pour toutes les positions en x jusqu\'à la bordure droite', () => {
    spyOn(service, 'findLeftBorder').and.returnValue(995);
    spyOn(service, 'checkBelowPixel').and.returnValue(false);
    spyOn(service, 'checkColor').and.returnValue(true);
    const spy = spyOn(service, 'checkAbovePixel').and.returnValue(false);
    service.fillWithColor();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('#fillWithColor devrait appeler checkBelowPixel pour toutes les positions en x jusqu\'à la bordure droite', () => {
    spyOn(service, 'findLeftBorder').and.returnValue(995);
    spyOn(service, 'checkAbovePixel').and.returnValue(false);
    spyOn(service, 'checkColor').and.returnValue(true);
    const spy = spyOn(service, 'checkBelowPixel').and.returnValue(false);
    service.fillWithColor();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('#fillWithColor devrait appeler addPixelPosition pour toutes les positions en x jusqu\'à la bordure droite', () => {
    spyOn(service, 'findLeftBorder').and.returnValue(995);
    spyOn(service, 'checkAbovePixel').and.returnValue(false);
    spyOn(service, 'checkBelowPixel').and.returnValue(false);
    spyOn(service, 'checkColor').and.returnValue(true);
    const spy = spyOn(service, 'addPixelPosition');
    service.fillWithColor();
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('#fillWithColor devrait appeler push sur les points du fill pour la position en x correspondant à la bordure droite', () => {
    spyOn(service, 'findLeftBorder').and.returnValue(1000);
    const spy = spyOn(service['fill'].points, 'push');
    service.fillWithColor();
    expect(spy).toHaveBeenCalledWith({x: svgElementStub.clientWidth, y: service['mousePosition'].y});
  });

  it('#fillWithColor ne devrait rien faire si le point dans queue n\'est pas valide', () => {
    delete service['mousePosition'];
    const spy = spyOn(service, 'findLeftBorder');
    service.fillWithColor();
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS findLeftBorder
  it('#findLeftBorder devrait appeler checkColor jusqu\'à que la position en x soit la bordure gauche', () => {
    const spy = spyOn(service, 'checkColor').and.returnValue(true);
    service.findLeftBorder({x: 4, y: 90});
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('#findLeftBorder devrait ajouter le point correspondant à la bordure gauche dans fill', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    const spy = spyOn(service['fill'].points, 'push');
    service.findLeftBorder({x: 5, y: 90});
    expect(spy).toHaveBeenCalledWith({x: 0, y: 90});
  });

  it('#findLeftBorder devrait retourner la valeur en x associée à la bordure gauche', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    expect(service.findLeftBorder({x: 5, y: 90})).toBe(0);
  });

  // TESTS checkAbovePixel
  it('#checkAbovePixel devrait renvoyer false si le pixel au-dessus est d\'une couleur différente', () => {
    spyOn(service, 'checkColor').and.returnValue(false);
    expect(service.checkAbovePixel({x: 5, y: 5}, true, [])).toBe(false);
  });

  it('#checkAbovePixel devrait renvoyer true si spanAbove est à false et que la position en y est toujours dans le dessin', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    expect(service.checkAbovePixel({x: 5, y: 4}, false, [])).toBe(true);
  });

  it('#checkAbovePixel devrait ajouter la position au-dessus dans queue si checkColor retourne vrai, '
    + 'que spanAbove est faux et que la position en y est toujours dans le dessin', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    const queue: Point[] = [];
    const spy = spyOn(queue, 'push');
    service.checkAbovePixel({x: 5, y: 4}, false, queue);
    expect(spy).toHaveBeenCalledWith({x: 5, y: 3});
  });

  it('#checkAbovePixel devrait retourner spanAbove si checkColor est vrai '
    + 'et que la position en y n\'est pas dans le dessin', () => {
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

  it('#checkBelowPixel devrait ajouter la position en-dessous dans queue si checkColor retourne vrai, '
    + 'que spanBelow est faux et que la position en y est toujours dans le dessin', () => {
    spyOn(service, 'checkColor').and.returnValue(true);
    const queue: Point[] = [];
    const spy = spyOn(queue, 'push');
    service.checkBelowPixel({x: 5, y: 4}, false, queue);
    expect(spy).toHaveBeenCalledWith({x: 5, y: 5});
  });

  it('#checkBelowPixel devrait retourner spanBelow si checkColor est vrai '
    + 'et que la position en y n\'est pas dans le dessin', () => {
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
  it('#checkColor devrait appeler get pour obtenir les valeur du point en x dans la map', () => {
    const spy = spyOn(service['checkedPixels'], 'get').and.returnValue([50]);
    service.checkColor({x: 25, y: 50});
    expect(spy).toHaveBeenCalledWith(25);
  });

  it('#checkColor devrait retourner false si la map contient y dans le tableau à la clé en x', () => {
    spyOn(service['checkedPixels'], 'get').and.returnValue([50]);
    expect(service.checkColor({x: 25, y: 50})).toBe(false);
  });

  it('#checkColor devrait appeler getIndex avec le point', () => {
    const spy = spyOn(service, 'getIndex');
    service.checkColor({x: 0, y: 0});
    expect(spy).toHaveBeenCalledWith({x: 0, y: 0});
  });

  it('#checkColor devrait retourner false si l\'écart entre le R du pixel et le R de color est supérieur à la tolérance', () => {
    service['color'] = [100, 100, 100];
    service['pixelData'][R] = 200;
    service['pixelData'][G] = 110;
    service['pixelData'][B] = 110;
    expect(service.checkColor({x: 0, y: 0})).toBe(false);
  });

  it('#checkColor devrait retourner false si l\'écart entre le G du pixel et le G de color est supérieur à la tolérance', () => {
    service['color'] = [100, 100, 100];
    service['pixelData'][R] = 110;
    service['pixelData'][G] = 200;
    service['pixelData'][B] = 110;
    expect(service.checkColor({x: 0, y: 0})).toBe(false);
  });

  it('#checkColor devrait retourner false si l\'écart entre le B du pixel et le B de color est supérieur à la tolérance', () => {
    service['color'] = [100, 100, 100];
    service['pixelData'][R] = 110;
    service['pixelData'][G] = 110;
    service['pixelData'][B] = 200;
    expect(service.checkColor({x: 0, y: 0})).toBe(false);
  });

  it('#checkColor devrait retourner true si l\'écart est inférieur à la tolérance en R, G et B', () => {
    service['color'] = [100, 100, 100];
    service['pixelData'][R] = 110;
    service['pixelData'][G] = 110;
    service['pixelData'][B] = 110;
    expect(service.checkColor({x: 0, y: 0})).toBe(true);
  });

  it('#checkColor devrait utiliser une tolérance de 0 si le paramètre n\'est pas défini dans l\'outil actif', () => {
    service['tools'].activeTool.parameters[0].value = undefined;
    service['color'] = [100, 100, 100];
    service['pixelData'][R] = 110;
    service['pixelData'][G] = 110;
    service['pixelData'][B] = 110;
    expect(service.checkColor({x: 0, y: 0})).toBe(false);
  });

  // TESTS getIndex

  it('#getIndex devrait créer un index unique pour une position du dessin', () => {
    const testIndex = (5 + 5 * service.drawing.clientWidth) * 4;
    expect(service.getIndex({x: 5, y: 5})).toEqual(testIndex);
  });
});
