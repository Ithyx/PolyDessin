import { TestBed } from '@angular/core/testing';

import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PaintBucketToolService } from './paint-bucket-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('PaintBucketToolService', () => {
  let service: PaintBucketToolService;
  let stockageService: SVGStockageService;
  let element: ColorFillService;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(PaintBucketToolService));
  beforeEach(() => stockageService = TestBed.get(SVGStockageService));

  beforeEach(() => {
    canvas = document.createElement('canvas');
    service.canvas = canvas;
    service['image'] = new Image();
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
      service['context'] = context;
    }

    service['commands'].drawingInProgress = true;
    service['tools'].activeTool = service['tools'].toolList[11];
    service['tools'].activeTool.parameters[0].value = 5;

    service['mousePosition'] = {x: 0, y: 0};
    service['checkedPixels'] = new Map<number, number[]>();

    element = new ColorFillService();
    service['color'] = [0, 0, 0];
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };

    stockageService.setOngoingSVG(element);
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

  /* CANVAS BEURK :P

  it('#createCanvas devrait assigner à context', () => {
    const contextTest = service.canvas.getContext('2d');
    service['context'] = contextTest;
    service.createCanvas();
    expect(spy).toHaveBeenCalledWith('2d');
  });

  // TESTS onImageLoad

  it('#onImageLoad devrait appeler la fonction drawImage', () => {
    const spy = spyOn(service['context'], 'drawImage');
    service['image'].onload = service.onImageLoad.bind(service);
    service.onImageLoad();
    expect(spy).toHaveBeenCalledWith(service['image'], 0, 0);
  });*/
});
