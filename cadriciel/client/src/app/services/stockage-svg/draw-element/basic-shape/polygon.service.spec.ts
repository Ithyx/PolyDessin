/* import { TestBed } from '@angular/core/testing';
import { PolygonService } from './polygon.service';

// tslint:disable: no-magic-numbers

describe('PolygonService', () => {
  let element: PolygonService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    element = new PolygonService();
    element.pointMin = {x: 10, y: 10};
    element.pointMax = {x: 100, y: 100};
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    element.chosenOption = 'Plein avec contour';
    element.erasingEvidence = false;
    element.thickness = 10;
    element.points = [{x: 50, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}];
    element.primaryColor = {
      RGBA: [65, 65, 65, 1],
      RGBAString: 'rgba(65, 65, 65, 1)'
    };
    element.secondaryColor = {
      RGBA: [35, 0, 35, 1],
      RGBAString: 'rgba(35, 0, 35, 1)'
    };
    element.erasingColor = {
      RGBA: [255, 0, 0, 1],
      RGBAString: 'rgba(255, 0, 0, 1)'
    };
  });

  it('should be created', () => {
    expect(element).toBeTruthy();
  });

  // TEST getWidth
  it('#getWidth devrait retourner la différence en x entre pointMin et pointMax', () => {
    expect(element.getWidth()).toEqual(90);
  });

  // TEST getHeight
  it('#getWidth devrait retourner la différence en y entre pointMin et pointMax', () => {
    expect(element.getWidth()).toEqual(90);
  });

  // TESTS draw
  it('#draw devrait appeler drawShape', () => {
    const spy = spyOn(element, 'drawShape');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });
  it('#draw devrait appeler drawPerimeter', () => {
    const spy = spyOn(element, 'drawPerimeter');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });

  // TEST drawLine
  it('#drawLine ne devrait rien faire', () => {
    element.drawLine();
    expect().nothing();
  });

  // TESTS drawShape
  it('#drawShape devrait attribuer le bon svg au polygone', () => {
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="rgba(35, 0, 35, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawShape();
    expect(element.svg).toEqual(svg);
  });
  it('#drawShape devrait attribuer le bon svg au polygone si chosenOption est Contour', () => {
    element.chosenOption = 'Contour';
    let svg = '<polygon transform=" translate(10 10)" fill="none" stroke="rgba(35, 0, 35, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawShape();
    expect(element.svg).toEqual(svg);
  });
  it('#drawShape devrait attribuer le bon svg au polygone si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="rgba(255, 0, 0, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawShape();
    expect(element.svg).toEqual(svg);
  });
  it('#drawShape devrait attribuer le bon svg au polygone si chosenOption est Plein', () => {
    element.chosenOption = 'Plein';
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="none" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawShape();
    expect(element.svg).toEqual(svg);
  });

  // TESTS drawPerimeter
  it('#drawPerimeter devrait attribuer le bon svg au périmètre si chosenOption est Plein', () => {
    element.chosenOption = 'Plein';
    let svg = '<rect stroke="gray" fill="none" stroke-width="2" ';
    svg += 'x="10" y="10" height="90" width="90"/>';
    element.drawPerimeter();
    expect(element.perimeter).toEqual(svg);
  });
  it('#drawPerimeter devrait attribuer le bon svg au périmètre si chosenOption n\'est pas Plein', () => {
    let svg = '<rect stroke="gray" fill="none" stroke-width="2" ';
    svg += 'x="5" y="5" height="100" width="100"/>';
    element.drawPerimeter();
    expect(element.perimeter).toEqual(svg);
  });
}); */
