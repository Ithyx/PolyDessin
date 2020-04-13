import { TestBed } from '@angular/core/testing';
import { TracePencilService } from './trace-pencil.service';
import { TraceService } from './trace.service';

// tslint:disable:no-magic-numbers

describe('TraceService', () => {
  let element: TraceService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    element = new TracePencilService();
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.thickness = 5;
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  });

  it('should be created', () => {
    expect(element).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait appeler drawPoint si isAPoint est vrai', () => {
    spyOn(element, 'drawPoint');
    element.isAPoint = true;
    element.draw();
    expect(element.drawPoint).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawPath si isAPoint est faux', () => {
    spyOn(element, 'drawPath');
    element.draw();
    expect(element.drawPath).toHaveBeenCalled();
  });

});
