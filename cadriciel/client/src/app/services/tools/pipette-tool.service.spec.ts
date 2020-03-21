/* import { TestBed } from '@angular/core/testing';

import { Scope } from '../color/color-manager.service';
import { PipetteToolService } from './pipette-tool.service';

describe('PipetteToolService', () => {
  let service: PipetteToolService;
  let canvas: HTMLCanvasElement;
  let svg: HTMLElement;
  let context: CanvasRenderingContext2D;
  const fakeSelector: (select: string) => HTMLElement | undefined = (select: string) => {
    if (select === '.drawing') { return svg; } else { return canvas; }
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    svg = document.createElement('svg');
    canvas = document.createElement('canvas');
    service = TestBed.get(PipetteToolService);
    service.colorParameter.primaryColor.RGBAString = 'primary';
    service.colorParameter.secondaryColor.RGBAString = 'secondary';
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
      service.context = context;
    }
    service.mousePosition = {x: 5, y: 5};
    service.image = new Image();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS DE onMouseClick

  it('#onMouseClick devrait appeler createCanvas', () => {
    spyOn(service, 'createCanvas');
    service.onMouseClick(new MouseEvent('click'));
    expect(service.createCanvas).toHaveBeenCalled();
  });

  it('#onMouseClick devrait changer le scope pour Primary', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.onMouseClick(new MouseEvent('click'));
    expect(service.colorScope).toEqual(Scope.Primary);
  });

  it('#onMouseClick devrait actualiser mousePosition avec les valeurs de la souris', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.onMouseClick(new MouseEvent('click', {clientX: 50, clientY: 50}));
    expect(service.mousePosition).toEqual({x: 50, y: 50});
  });

  // TESTS DE onRightClick

  it('#onRightClick devrait appeler createCanvas', () => {
    spyOn(service, 'createCanvas');
    service.onRightClick(new MouseEvent('contextmenu'));
    expect(service.createCanvas).toHaveBeenCalled();
  });

  it('#onRightClick devrait changer le scope pour Secondary', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.onRightClick(new MouseEvent('contextmenu'));
    expect(service.colorScope).toEqual(Scope.Secondary);
  });

  it('#onRightClick devrait actualiser mousePosition avec les valeurs de la souris', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.onRightClick(new MouseEvent('contextmenu', {clientX: 50, clientY: 50}));
    expect(service.mousePosition).toEqual({x: 50, y: 50});
  });

  // TESTS DE createCanvas

  it('#createCanvas devrait aller chercher le SVG du dessin', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.createCanvas();
    expect(document.querySelector).toHaveBeenCalledWith('.drawing');
  });

  it('#createCanvas devrait aller chercher le canvas', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.createCanvas();
    expect(document.querySelector).toHaveBeenCalledWith('.canvas');
  });

  it('#createCanvas devrait aller chercher le contexte du canvas', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    spyOn(canvas, 'getContext');
    service.createCanvas();
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('#createCanvas ne devrait rien faire si le dessin n\'est pas défini', () => {
    spyOn(document, 'querySelector').and.callFake((select: string) => {
      if (select === '.drawing') { return undefined; } else { return canvas; }
    });
    service.image.src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service.image.src).toEqual('http://localhost:9876/test');
  });

  it('#createCanvas ne devrait rien faire si le contexte n\'est pas défini', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    spyOn(canvas, 'getContext').and.callFake(() => null);
    service.image.src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service.image.src).toEqual('http://localhost:9876/test');
  });

  it('#createCanvas devrait actualiser le contexte', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.createCanvas();
    expect(service.context).toEqual(context);
  });

  it('#createCanvas devrait charger la fonction pickColor dans l\'image', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.createCanvas();
    expect(JSON.stringify(service.image.onload)).toEqual(JSON.stringify(service.pickColor));
  });

  it('#createCanvas devrait charger l\'URL de l\'image du SVG dans le src de l\'image', () => {
    spyOn(document, 'querySelector').and.callFake(fakeSelector);
    service.image.src = 'http://localhost:9876/test';
    service.createCanvas();
    expect(service.image.src).not.toEqual('http://localhost:9876/test');
  });

  // TESTS DE pickColor

  it('#pickColor devrait dessiner l\'image sur le contexte', () => {
    spyOn(service.context, 'drawImage');
    service.pickColor();
    expect(service.context.drawImage).toHaveBeenCalledWith(service.image, 0, 0);
  });

  it('#pickColor devrait changer la couleur principale si le scope est Primary', () => {
    service.colorScope = Scope.Primary;
    service.colorParameter.primaryColor.RGBAString = 'primary';
    service.pickColor();
    expect(service.colorParameter.primaryColor.RGBAString).toEqual('rgba(0, 0, 0, ');
  });

  it('#pickColor devrait changer la couleur secondaire si le scope est Secondary', () => {
    service.colorScope = Scope.Secondary;
    service.colorParameter.secondaryColor.RGBAString = 'secondary';
    service.pickColor();
    expect(service.colorParameter.secondaryColor.RGBAString).toEqual('rgba(0, 0, 0, ');
  });

  it('#pickColor ne devrait rien faire si le scope n\'est pas Primary ou Secondary', () => {
    service.colorScope = Scope.Default;
    service.colorParameter.primaryColor.RGBAString = 'primary';
    service.colorParameter.secondaryColor.RGBAString = 'secondary';
    service.pickColor();
    expect(service.colorParameter.primaryColor.RGBAString).toEqual('primary');
    expect(service.colorParameter.secondaryColor.RGBAString).toEqual('secondary');
  });
}); */
