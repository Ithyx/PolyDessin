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
});
