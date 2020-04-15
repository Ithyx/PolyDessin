/* import { TestBed } from '@angular/core/testing';
import { EllipseService } from './ellipse.service';

// tslint:disable:no-magic-numbers

describe('EllipseService', () => {
  let element: EllipseService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    element = new EllipseService();
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
  });

  it('should be created', () => {
    const testService: EllipseService = TestBed.get(EllipseService);
    expect(testService).toBeTruthy();
  });

  /* 
  // TESTS drawLine

  it('#drawLine devrait attribuer le bon stroke si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    const test = '<line stroke-linecap="round'
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" stroke="' + element.erasingColor.RGBAString
    + '" stroke-width="' + element.thickness
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  it('#drawLine devrait attribuer le bon stroke si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    const test = '<line stroke-linecap="round'
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" stroke="' + element.secondaryColor.RGBAString
    + '" stroke-width="' + element.thickness
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"></line>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  // TESTS drawShape

  it('#drawShape devrait attribuer le bon fill si l\'option choisie n\'est pas \'Contour\'', () => {
    element.chosenOption = 'Vide';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + element.primaryColor.RGBAString
    + '" stroke="'
    + ((element.erasingEvidence) ? element.erasingColor.RGBAString :
      ((element.chosenOption !== 'Plein') ? element.secondaryColor.RGBAString : 'none'))
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"></ellipse>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait attribuer le bon fill si l\'option choisie est \'Contour\'', () => {
    element.chosenOption = 'Contour';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + 'none'
    + '" stroke="'
    + ((element.erasingEvidence) ? element.erasingColor.RGBAString :
      ((element.chosenOption !== 'Plein') ? element.secondaryColor.RGBAString : 'none'))
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"></ellipse>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait attribuer le bon svg quand erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.chosenOption = 'Vide';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + element.primaryColor.RGBAString
    + '" stroke="'
    + ((element.erasingEvidence) ? element.erasingColor.RGBAString : element.secondaryColor.RGBAString)
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"></ellipse>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait attribuer le bon svg si l\'option choisie n\'est pas \'Plein\' quand erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.chosenOption = 'Vide';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + ((element.chosenOption !== 'Contour') ? element.primaryColor.RGBAString : 'none')
    + '" stroke="'
    + ((element.erasingEvidence) ? element.erasingColor.RGBAString : element.secondaryColor.RGBAString)
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"></ellipse>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  });

  it('#drawShape devrait attribuer le bon svg si l\'option choisie est \'Plein\' quand erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.chosenOption = 'Plein';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + ((element.chosenOption !== 'Contour') ? element.primaryColor.RGBAString : 'none')
    + '" stroke="'
    + ((element.erasingEvidence) ? element.erasingColor.RGBAString : 'none')
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"></ellipse>';

    element.drawShape();
    expect(element.svg).toEqual(test);
  }); 

  // TESTS drawPerimeter

  it('#drawPerimeter devrait attribuer le bon perimeter si chosenOption est \'Plein\'', () => {
    element.chosenOption = 'Plein';
    const test = '<rect stroke="gray" fill="none" stroke-width="2"'
    + ' x="' + element.points[0].x + '" y="' + element.points[0].y
    + '" height="' + element.getHeight() + '" width="' + element.getWidth() + '"/>';

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
    const test = '<rect stroke="gray" fill="none" stroke-width="2"'
    + ' x="' + (element.points[0].x - thicknessTest / 2)
    + '" y="' + (element.points[0].y - thicknessTest / 2)
    + '" height="' + thicknessTest + '" width="' + thicknessTest + '"/>';

    element.drawPerimeter();
    expect(element.perimeter).toEqual(test);
  });
}); */
