import { TestBed } from '@angular/core/testing';
import { DrawElement } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { RemoveSVGService } from './remove-svg.service';

// tslint:disable: no-string-literal

let firstElement: DrawElement;
let secondElement: DrawElement;
let thirdElement: DrawElement;

const stockageStub: Partial<SVGStockageService> = {
  removeSVG(element: DrawElement): void { return; },
  addSVG(element: DrawElement): void { return; },
  getCompleteSVG(): DrawElement[] { return [firstElement, secondElement, thirdElement]; }
};

describe('RetraitSvgService', () => {
  let service: RemoveSVGService;
  let stockage: SVGStockageService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: SVGStockageService, useValue: stockageStub}]
  }));
  beforeEach(() => {
    stockage = TestBed.get(SVGStockageService);

    firstElement = new TracePencilService();
    firstElement.points = [{x: 0, y: 0}, {x: 1, y: 2}, {x: 0, y: 3}];
    firstElement.draw();

    secondElement = new RectangleService();
    secondElement.points = [{x: 3, y: 7}, {x: 2, y: 5}];
    secondElement.draw();

    thirdElement = new TracePencilService();
    thirdElement.points = [{x: 0, y: 0}];
    thirdElement.isAPoint = true;
    thirdElement.draw();

    service = new RemoveSVGService(stockage);
    service['elementsKeys'] = [1, 0, 2];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructor

  it('#constructor devrait assigner un tableau vide à elementsKeys', () => {
    service = new RemoveSVGService(stockage);
    expect(service['elementsKeys']).toEqual([]);
  });

  it('#constructor devrait assigner une copie du tableau de getCompleteSVG à elementsBeforeRemove', () => {
    service = new RemoveSVGService(stockage);
    expect(service['elementsBeforeRemove']).toEqual([firstElement, secondElement, thirdElement]);
  });

  // TESTS undo

  it('#undo devrait appeler sort sur elementsKeys', () => {
    spyOn(service['elementsKeys'], 'sort');
    service.undo();
    expect(service['elementsKeys'].sort).toHaveBeenCalled();
  });

  it('#undo devrait appeler addSVG pour tous les élements correspondant aux elementsKeys', () => {
    spyOn(stockage, 'addSVG');
    service.undo();
    expect(stockage.addSVG).toHaveBeenCalledWith(firstElement);
    expect(stockage.addSVG).toHaveBeenCalledWith(secondElement);
    expect(stockage.addSVG).toHaveBeenCalledWith(thirdElement);
  });

  // TEST redo

  it('#redo devrait appeler removeSVG pour tous les élements correspondant aux elementsKeys', () => {
    spyOn(stockage, 'removeSVG');
    service.redo();
    expect(stockage.removeSVG).toHaveBeenCalledWith(firstElement);
    expect(stockage.removeSVG).toHaveBeenCalledWith(secondElement);
    expect(stockage.removeSVG).toHaveBeenCalledWith(thirdElement);
  });

  // TESTS addElements

  it('#addElements devrait appeler removeSVG pour tous les élements passés en paramètre', () => {
    spyOn(stockage, 'removeSVG');
    service.addElements([secondElement, thirdElement]);
    expect(stockage.removeSVG).not.toHaveBeenCalledWith(firstElement);
    expect(stockage.removeSVG).toHaveBeenCalledWith(secondElement);
    expect(stockage.removeSVG).toHaveBeenCalledWith(thirdElement);
  });

  it('#addElements devrait appeler indexOf de elementsKeys pour obtenir la clé de chaque élément en paramètre', () => {
    spyOn(service['elementsBeforeRemove'], 'indexOf');
    service.addElements([secondElement, thirdElement]);
    expect(service['elementsBeforeRemove'].indexOf).not.toHaveBeenCalledWith(firstElement);
    expect(service['elementsBeforeRemove'].indexOf).toHaveBeenCalledWith(secondElement);
    expect(service['elementsBeforeRemove'].indexOf).toHaveBeenCalledWith(thirdElement);
  });

  it('#addElements devrait ajouter la clé de tous les éléments passés en paramètre dans elementsKeys', () => {
    service['elementsKeys'] = [];
    service.addElements([secondElement, thirdElement]);
    expect(service['elementsKeys']).toEqual([1, 2]);
  });

  // TESTS isEmpty

  it('#isEmpty devrait retourner true si elementsKeys est vide', () => {
    service['elementsKeys'] = [];
    expect(service.isEmpty()).toBe(true);
  });

  it('#isEmpty devrait retourner false si elementsKeys n\'est pas vide', () => {
    expect(service.isEmpty()).toBe(false);
  });

});
