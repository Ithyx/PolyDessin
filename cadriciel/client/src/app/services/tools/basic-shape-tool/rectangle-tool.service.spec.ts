import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../../stockage-svg/basic-shape/rectangle.service';
import { RectangleToolService } from './rectangle-tool.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('RectangleToolService', () => {
  let service: RectangleToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(RectangleToolService));

  // TESTS clear

  it('#clear devrait mettre commandes.drawingInProgress faux', () => {
    service['commands'].drawingInProgress = true;
    service.clear();
    expect(service['commands'].drawingInProgress).toBe(false);
  });

  it('#clear devrait reinitialiser l\'ellipse', () => {
    service['shape'] = new RectangleService();
    service['shape'].points = [{x: 0, y: 0}, {x: 10, y: 10}];
    service.clear();
    // vérifier que le SVG est vide
    expect(service['shape']).toEqual(new RectangleService());
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
