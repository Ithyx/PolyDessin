import { TestBed } from '@angular/core/testing';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-magic-numbers

describe('RectangleService', () => {
  let element: RectangleService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    element = new RectangleService();
    element.points[0].x = 10;
    element.points[0].y = 100;
    element.points[1].x = 100;
    element.points[1].y = 10;
    element.chosenOption = 'Vide';
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.secondaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.thickness = 5;
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    element.isDotted = true;
  });

  it('should be created', () => {
    const testService: RectangleService = TestBed.get(RectangleService);
    expect(testService).toBeTruthy();
  });

  // TESTS drawLine

  it('#drawLine devrait attribuer le bon stroke si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    const test = '<line stroke-linecap="square'
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" stroke="' + element.erasingColor.RGBAString
    + '" stroke-width="' + element.thickness
    + '"stroke-dasharray="2, 8"'
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  it('#drawLine devrait attribuer le bon stroke si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    const test = '<line stroke-linecap="square'
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" stroke="' + element.secondaryColor.RGBAString
    + '" stroke-width="' + element.thickness
    + '"stroke-dasharray="2, 8"'
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  it('#drawLine devrait attribuer le bon stroke-width si isDotted vrai', () => {
    const test = '<line stroke-linecap="square'
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" stroke="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.secondaryColor.RGBAString)
    + '" stroke-width="' + element.thickness
    + '"stroke-dasharray="2, 8"'
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  it('#drawLine devrait attribuer le bon stroke-width si isDotted faux', () => {
    element.isDotted = false;
    const test = '<line stroke-linecap="square'
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" stroke="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.secondaryColor.RGBAString)
    + '" stroke-width="' + element.thickness
    + ''
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  // TESTS drawShape

  it('#drawShape devrait attribuer le bon svg si chosenOption n\'est pas \'Contour\'', () => {
    element.chosenOption = 'Vide';
    const test = '<rect transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f +
    ')" fill="' + element.primaryColor.RGBAString + '" stroke="none'
    + '" x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" width="' + element.getWidth() + '" height="' + element.getHeight() + '"></rect>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait attribuer le bon svg si chosenOption est \'Contour\'', () => {
    element.chosenOption = 'Contour';
    const test = '<rect transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f +
    ')" fill="' + 'none' + '" stroke="none'
    + '" x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" width="' + element.getWidth() + '" height="' + element.getHeight() + '"></rect>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait appeler la fonction addRectanglePoints', () => {
    const spy = spyOn(element, 'addRectanglePoints');
    element.drawShape();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS drawPerimeter

  it('#drawPerimeter devrait attribuer le bon perimeter si chosenOption est \'Plein\'', () => {
    element.chosenOption = 'Plein';
    const test = '<rect stroke="gray" fill="none" stroke-width="2"stroke-dasharray="4, 4"'
    + '" x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" height="' + element.getHeight() + '" width="' + element.getWidth() + '"></rect>';

    element.drawPerimeter();
    expect(element.perimeter).toEqual(test);
  });

  it('#drawPerimeter devrait attribuer le bon perimeter dans la branche chosenOption n\'est pas \'Plein\''
  + 'si Height et Width non nuls', () => {
    element.chosenOption = 'Vide';
    const thicknessTest = element.thickness;
    const test = '<rect stroke="gray" fill="none" stroke-width="2"stroke-dasharray="4, 4"'
    + '" x="' + (element.points[0].x - thicknessTest / 2)
    + '" y="' + (element.points[0].y - thicknessTest / 2)
    + '" height="' + (element.getHeight() + thicknessTest)
    + '" width="' + (element.getWidth() + thicknessTest) + '"></rect>';

    element.drawPerimeter();
    expect(element.perimeter).toEqual(test);
  });

  it('#drawPerimeter devrait attribuer le bon perimeter dans la branche chosenOption n\'est pas \'Plein\''
  + 'si Height et Width sont nuls', () => {
    element.points = [];
    element.points.push({x: 10, y: 10});
    element.points.push({x: 10, y: 10});
    element.chosenOption = 'Vide';
    const thicknessTest = element.thickness;
    const test = '<rect stroke="gray" fill="none" stroke-width="2"stroke-dasharray="4, 4"'
    + '" x="' + (element.points[0].x - thicknessTest / 2)
    + '" y="' + (element.points[0].y - thicknessTest / 2)
    + '" height="' + thicknessTest + '" width="' + thicknessTest + '"></rect>';

    element.drawPerimeter();
    expect(element.perimeter).toEqual(test);
  });

  it('#drawPerimeter devrait attribuer le bon perimeter si isDotted est false dans la branche chosenOption est \'Plein\'', () => {
    element.isDotted = false;
    element.chosenOption = 'Plein';
    const test = '<rect stroke="gray" fill="none" stroke-width="2'
    + '" x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" height="' + element.getHeight() + '" width="' + element.getWidth() + '"></rect>';

    element.drawPerimeter();
    expect(element.perimeter).toEqual(test);
  });

  it('#drawPerimeter devrait appeler la fonction addRectanglePoints', () => {
    const spy = spyOn(element, 'addRectanglePoints');
    element.drawPerimeter();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS addRectanglePoints

  it('#addRectanglePoints devrait appeler la fonction splice de points', () => {
    const spy = spyOn(element.points, 'splice');
    element.addRectanglePoints();
    expect(spy).toHaveBeenCalledWith(2, 2);
  });

  it('#addRectanglePoints devrait appeler la fonction push de points', () => {
    const spy = spyOn(element.points, 'push');
    element.addRectanglePoints();
    expect(spy).toHaveBeenCalledWith({x: element.points[1].x, y: element.points[0].y}, {x: element.points[0].x, y: element.points[1].y});
  });
});
