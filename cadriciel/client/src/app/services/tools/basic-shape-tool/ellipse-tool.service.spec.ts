import { TestBed } from '@angular/core/testing';

import { EllipseService } from '../../stockage-svg/draw-element/basic-shape/ellipse.service';
import { EllipseToolService } from './ellipse-tool.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('EllipseToolService', () => {
  let service: EllipseToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(EllipseToolService));

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
});
