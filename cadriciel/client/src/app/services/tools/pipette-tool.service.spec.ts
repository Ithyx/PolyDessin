import { TestBed } from '@angular/core/testing';

import { Scope } from '../color/color-manager.service';
import { PipetteToolService } from './pipette-tool.service';

describe('PipetteToolService', () => {
  let service: PipetteToolService;
  let canvas: HTMLCanvasElement;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    canvas = document.createElement('canvas');
    spyOn(document, 'querySelector').and.callFake(() => {
      return canvas;
    });
    service = TestBed.get(PipetteToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS DE onMouseClick ET onRightClick

  it('#onMouseClick devrait appeler pickColor avec le scope Primary', () => {
    spyOn(service, 'pickColor');
    const event = new MouseEvent('click');
    service.onMouseClick(event);
    expect(service.pickColor).toHaveBeenCalledWith(event, Scope.Primary);
  });

  it('#onRightClick devrait appeler pickColor avec le scope Secondary', () => {
    spyOn(service, 'pickColor');
    const event = new MouseEvent('contextmenu');
    service.onRightClick(event);
    expect(service.pickColor).toHaveBeenCalledWith(event, Scope.Secondary);
  });

  // TESTS DE pickColor

  it('#pickColor devrait aller chercher le SVG du dessin', () => {
    service.pickColor(new MouseEvent('click'), Scope.Default);
    expect(document.querySelector).toHaveBeenCalledWith('.drawing');
  });

  it('#pickColor devrait aller chercher le canvas', () => {
    service.pickColor(new MouseEvent('click'), Scope.Default);
    expect(document.querySelector).toHaveBeenCalledWith('.canvas');
  });

  it('#pickColor devrait aller chercher le contexte du canvas', () => {
    spyOn(canvas, 'getContext');
    service.pickColor(new MouseEvent('click'), Scope.Default);
    expect(canvas.getContext).toHaveBeenCalledWith('2d');
  });
});
