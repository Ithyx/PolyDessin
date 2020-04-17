import { TestBed } from '@angular/core/testing';

import { ANGLE_VARIATION, EllipseService } from '../../stockage-svg/draw-element/basic-shape/ellipse.service';
import { Point } from '../../stockage-svg/draw-element/draw-element';
import { BasicShapeToolService } from './basic-shape-tool.service';
import { EllipseToolService } from './ellipse-tool.service';
import { ENDING_ANGLE, STARTING_ANGLE } from './polygon-tool.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('EllipseToolService', () => {
  let service: EllipseToolService;
  let basicShapeToolSpy: jasmine.Spy<() => void>;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(EllipseToolService);
    basicShapeToolSpy = spyOn(BasicShapeToolService.prototype, 'refreshSVG').and.callFake(() => { return; });
  });

  // TESTS clear

  it('#clear devrait mettre commandes.drawingInProgress faux', () => {
    service['commands'].drawingInProgress = true;
    service.clear();
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  it('#clear devrait reinitialiser l\'ellipse', () => {
    service['shape'] = new EllipseService();
    service['shape'].points = [{x: 0, y: 0}, {x: 10, y: 10}];
    service.clear();
    // vérifier que le SVG est vide
    expect(service['shape']).toEqual(new EllipseService());
  });

  it('#clear devrait mettre (0,0) à initial', () => {
    service['initial'] = {x: 15, y: 15};
    service.clear();
    expect(service['initial']).toEqual({x: 0, y: 0});
  });

  it('#clear devrait mettre (0,0) à calculatedBase', () => {
    service['calculatedBase'] = {x: 15, y: 15};
    service.clear();
    expect(service['calculatedBase']).toEqual({x: 0, y: 0});
  });

  it('#clear devrait mettre 0 à calculatedWidth', () => {
    service['calculatedWidth'] = 28;
    service.clear();
    expect(service['calculatedWidth']).toEqual(0);
  });

  it('#clear devrait mettre 0 à calculatedHeight', () => {
    service['calculatedHeight'] = 28;
    service.clear();
    expect(service['calculatedHeight']).toEqual(0);
  });

  // TESTS refreshSVG

  it('#refreshSVG devrait actualiser le pointMin de l\'ellipse', () => {
    service['shape'].points[0] = {x: 15, y: 22};
    service.refreshSVG();
    expect(service['shape'].pointMin).toEqual({x: 15, y: 22});
  });
  it('#refreshSVG devrait actualiser le pointMax de l\'ellipse', () => {
    service['shape'].points[0] = {x: 18, y: 28};
    service.refreshSVG();
    expect(service['shape'].pointMin).toEqual({x: 18, y: 28});
  });
  it('#refreshSVG devrait ajouter des points sur tout le contour de l\'ellipse', () => {
    service['shape'].points = [{x: 0, y: 0}, {x: 10, y: 10}];
    const points: Point[] = [];
    for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += Math.PI / ANGLE_VARIATION) {
      points.push({
        x: 5 * Math.cos(angle) + 5,
        y: 5 * Math.sin(angle) + 5
      });
    }
    service.refreshSVG();
    expect(service['shape'].points).toEqual(points);
  });
  it('#refreshSVG devrait appeler refreshSVG de BasicShapeToolService', () => {
    service.refreshSVG();
    expect(basicShapeToolSpy).toHaveBeenCalled();
  });
});
