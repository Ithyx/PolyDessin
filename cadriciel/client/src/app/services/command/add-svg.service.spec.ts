import { TestBed } from '@angular/core/testing';
import { DrawElement } from '../stockage-svg/draw-element';
import { LineService } from '../stockage-svg/line.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { AddSVGService } from './add-svg.service';

// tslint:disable: no-string-literal

describe('AddSVGService', () =>  {
  let service: AddSVGService;
  let stockageService: SVGStockageService;
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    element = new LineService();
    element.svg = 'test element';
    service = new AddSVGService(element, stockageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructor

  it('#constructor devrait ajouter l\'élément au stockage SVG', () => {
    spyOn(stockageService, 'addSVG');
    service = new AddSVGService(element, stockageService);
    expect(stockageService.addSVG).toHaveBeenCalledWith(element);
  });

  it('#constructor devrait changer l\'élément', () => {
    service = new AddSVGService(element, stockageService);
    expect(service['element']).toEqual(element);
  });

  // TESTS undo

  it('#undo devrait retirer l\'élément du stockage SVG', () => {
    spyOn(stockageService, 'removeSVG');
    service.undo();
    expect(stockageService.removeSVG).toHaveBeenCalledWith(element);
  });

  // TESTS redo

  it('#redo devrait ajouter l\'élément au stockage SVG', () => {
    spyOn(stockageService, 'addSVG');
    service.redo();
    expect(stockageService.addSVG).toHaveBeenCalledWith(element);
  });
});
