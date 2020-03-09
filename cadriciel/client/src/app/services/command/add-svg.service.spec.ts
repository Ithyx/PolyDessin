import { TestBed } from '@angular/core/testing';
import { DrawElement } from '../stockage-svg/draw-element';
import { LineService } from '../stockage-svg/line.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { AddSVGService } from './add-svg.service';

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

  it('#constructor devrait changer le svgKey pour l\'index du stockage SVG', () => {
    service = new AddSVGService(element, stockageService);
    expect(service.svgKey).toBe(stockageService.size - 1);
  });

  // TESTS undo

  it('#undo devrait retirer l\'élément du stockage SVG', () => {
    spyOn(stockageService, 'removeSVG');
    service.undo();
    expect(stockageService.removeSVG).toHaveBeenCalledWith(service.svgKey);
  });

  it('#undo devrait garder en mémoire l\'élément retiré s\'il existe', () => {
    service.element = new RectangleService();
    service.undo();
    expect(service.element).toEqual(element);
  });

  it('#undo ne devrait pas garder en mémoire l\'élément retiré s\'il n\'existe pas', () => {
    stockageService.removeLastSVG();
    stockageService.removeLastSVG();
    service.element = new RectangleService();
    service.undo();
    expect(service.element).toEqual(new RectangleService());
  });

  // TESTS redo

  it('#redo devrait ajouter l\'élément au stockage SVG', () => {
    spyOn(stockageService, 'addSVG');
    service.redo();
    expect(stockageService.addSVG).toHaveBeenCalledWith(element);
  });

  it('#redo devrait changer svgKey pour le nouvel id dans le stockage SVG', () => {
    service.redo();
    expect(service.svgKey).toBe(stockageService.size - 1);
  });
});
