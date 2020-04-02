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
    element.translate = { x: 10, y: 10};
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

  // TESTS updatePosition

  it('#updatePosition devrait ajouter les valeurs en paramètre à translate', () => {
    element.updatePosition(10, -25);
    expect(element.translate.x).toEqual(20);
    expect(element.translate.y).toEqual(-15);
  });

  it('#updatePosition devrait appeler draw', () => {
    spyOn(element, 'draw');
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse devrait ajouter les valeurs en paramètre à translate', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.translate.x).toEqual(90);
    expect(element.translate.y).toEqual(90);
  });

  it('#updatePositionMouse devrait appeler draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS translateAllPoints

  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
    element.points.push({x: 10, y: 10});
    element.translateAllPoints();
    expect(element.points[0].x).toEqual(20);
    expect(element.points[0].y).toEqual(20);
  });

  it('#translateAllPoints devrait mettre translation à 0', () => {
    element.translateAllPoints();
    expect(element.translate).toEqual({x: 0, y: 0});
  });
});
