import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ExportService } from './export.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ExportService', () => {
  let service: ExportService;
  let context: CanvasRenderingContext2D;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));
  beforeEach(() => service = TestBed.get(ExportService));
  beforeEach(() => {
    const canvas = document.createElement('canvas');
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS drawAuthorCanvas

  it('#drawAuthorCanvas devrait modifier le style du context pour le nom d\'auteur', () => {
    service.drawAuthorCanvas(context, '', 500);
    expect(context.font).toEqual('30px Arial');
    expect(context.strokeStyle).toEqual('#ffffff');
    expect(context.lineWidth).toEqual(3);
  });

  it('#drawAuthorCanvas devrait appeler strokeText du context', () => {
    const spy = spyOn(context, 'strokeText');
    const authorName = '';
    service.drawAuthorCanvas(context, authorName, 500);
    expect(spy).toHaveBeenCalledWith(`auteur: ${authorName}`, 0, 495);
  });

  it('#drawAuthorCanvas devrait appeler strokeText du context', () => {
    const spy = spyOn(context, 'fillText');
    const authorName = '';
    service.drawAuthorCanvas(context, authorName, 500);
    expect(spy).toHaveBeenCalledWith(`auteur: ${authorName}`, 0, 495);
  });
});
