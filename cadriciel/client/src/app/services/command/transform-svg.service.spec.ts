import { TestBed } from '@angular/core/testing';

import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement, TransformMatrix } from '../stockage-svg/draw-element/draw-element';
import { TransformSvgService } from './transform-svg.service';

// tslint:disable: no-string-literal

describe('TransformSvgService', () => {
  let service: TransformSvgService;
  let elements: DrawElement[];
  let sanitizer: DomSanitizer;
  let testElement: DrawElement;
  const drawElementStub: Partial<DrawElement> = {
    svg: '',
    svgHtml: '',
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw(): void { return; }
  };
  const testElementStub: Partial<DrawElement> = {
    svg: '',
    svgHtml: '',
    transform: {a: 0, b: 1, c: 2, d: 2, e: 1, f: 0},
    draw(): void { return; }
  };
  const deleteBoundingBoxStub = () => { return; };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: DrawElement, useValue: drawElementStub}]
  }));
  beforeEach(() => {
    testElement = testElementStub as DrawElement;
    elements = [testElement];
    sanitizer = TestBed.get(DomSanitizer);
    service = new TransformSvgService(elements, sanitizer, deleteBoundingBoxStub);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructeur
  it('#constructor devrait appeler set de la map elements avec les éléments et leur transform', () => {
    const spy = spyOn(Map.prototype, 'set');
    service = new TransformSvgService(elements, TestBed.get(DomSanitizer), deleteBoundingBoxStub);
    expect(spy).toHaveBeenCalledWith(testElement, testElement.transform);
  });

  // TESTS undo
  it('#undo devrait appeler changeTransform', () => {
    const spy = spyOn(service, 'changeTransform');
    service.undo();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS redo
  it('#redo devrait appeler changeTransform', () => {
    const spy = spyOn(service, 'changeTransform');
    service.redo();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS changeTransform
  it('#changeTransform devrait appeler forEach pour parcourir les éléments', () => {
    const spy = spyOn(service['elements'], 'forEach');
    service.changeTransform();
    expect(spy).toHaveBeenCalled();
  });
  it('#changeTransform devrait changer le transform des éléments par ceux dans la map', () => {
    const transform: TransformMatrix = {a: 0, b: 0, c: 1, d: 0, e: 0, f: 1};
    service['elements'].set((testElement as DrawElement), {transform, strokePoints: []});
    service.changeTransform();
    expect(testElement.transform).toEqual(transform);
  });
  it('#changeTransform devrait appeler set pour actualiser la valeur du transform dans la map', () => {
    const transform: TransformMatrix = {a: 1, b: 0, c: 1, d: 0, e: 1, f: 1};
    testElement.transform = {...transform};
    service.changeTransform();
    expect(service['elements'].get(testElement as DrawElement)).toEqual({transform, strokePoints: []});
  });
  it('#changeTransform devrait appeler draw sur les éléments', () => {
    const spy = spyOn(testElement, 'draw');
    service.changeTransform();
    expect(spy).toHaveBeenCalled();
  });
  it('#changeTransform devrait changer le svgHtml des éléments', () => {
    testElement.svg = 'test';
    const svgHtml = sanitizer.bypassSecurityTrustHtml(testElement.svg);
    service.changeTransform();
    expect(testElement.svgHtml).toEqual(svgHtml);
  });

  // TESTS hasMoved
  it('#hasMoved devrait appeler keys de elements pour obtenir un itérateur sur les éléments', () => {
    const spy = spyOn(service['elements'], 'keys').and.callThrough();
    service.hasMoved();
    expect(spy).toHaveBeenCalled();
  });
  it('#hasMoved devrait appeler get sur la map pour obtenir le transform associé au premier élément', () => {
    const spy = spyOn(service['elements'], 'get');
    service.hasMoved();
    expect(spy).toHaveBeenCalledWith(testElement);
  });
  it('#hasMoved devrait retourner faux si le transform associé au premier élément est identique au transform réel', () => {
    testElement.transform = {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1};
    service['elements'].set(testElement, {transform: testElement.transform, strokePoints: []});
    expect(service.hasMoved()).toBe(false);
  });
  it('#hasMoved devrait retourner faux si le transform associé au premier élément diffère du transform réel', () => {
    testElement.transform = {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1};
    service['elements'].set(testElement, {transform: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0}, strokePoints: []});
    expect(service.hasMoved()).toBe(true);
  });
});
