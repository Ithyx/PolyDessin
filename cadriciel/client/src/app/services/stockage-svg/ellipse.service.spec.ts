import { TestBed } from '@angular/core/testing';

import { DrawingToolService } from '../tools/pencil-tool.service';
import { EllipseService } from './ellipse.service';

// tslint:disable:no-magic-numbers

describe('EllipseService', () => {
  let service: DrawingToolService;
  let element: EllipseService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DrawingToolService));

  beforeEach(() => {
    element = new EllipseService();
    element.updateParameters(service.tools.toolList[8]);
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
    element.translate = { x: 10, y: 10};
  });

  it('should be created', () => {
    const testService: EllipseService = TestBed.get(EllipseService);
    expect(testService).toBeTruthy();
  });

  // TESTS getWidth

  it('#getWidth devrait retourner la largeur', () => {
    let test = element.getWidth();
    expect(test).toEqual(90);
    element.points[0].x = 100;
    element.points[1].x = 10;
    test = element.getWidth();
    expect(test).toEqual(90);
  });

  // TESTS getHeight

  it('#getHeight devrait retourner la hauteur', () => {
    let test = element.getHeight();
    expect(test).toEqual(90);
    element.points[0].y = 100;
    element.points[1].y = 10;
    test = element.getHeight();
    expect(test).toEqual(90);
  });

  // TESTS draw

  it('#draw devrait satisfaire les conditions pour appeler drawLine()', () => {
    element.points[0].x = 0;
    element.points[1].x = 0;
    element.points[0].y = 0;
    element.points[1].y = 0;
    spyOn(element, 'drawLine');
    element.draw();
    expect(element.drawLine).toHaveBeenCalled();
  });

  it('#draw ne devrait pas satisfaire les conditions pour appeler drawLine() avec width et height pas à 0', () => {
    spyOn(element, 'drawLine');
    element.draw();
    expect(element.drawLine).not.toHaveBeenCalled();
  });

  it('#draw devrait appeler drawEllipse() en ne satisfaisant pas les conditions pour avec chosenOption à \'Plein\'', () => {
    element.points[0].x = 0;
    element.points[1].x = 0;
    element.points[0].y = 0;
    element.points[1].y = 0;
    element.chosenOption = 'Plein';
    spyOn(element, 'drawEllipse');
    element.draw();
    expect(element.drawEllipse).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawPerimeter', () => {
    spyOn(element, 'drawPerimeter');
    element.draw();
    expect(element.drawPerimeter).toHaveBeenCalled();
  });

  // TESTS drawLine

  it('#drawLine devrait attribuer le bon svg', () => {
    const test = '<line stroke-linecap="round'
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" stroke="' + element.secondaryColor
    + '" stroke-width="' + element.thickness
    + '" x1="' + element.points[0].x + '" y1="' + element.points[0].y
    + '" x2="' + (element.points[0].x + element.getWidth())
    + '" y2="' + (element.points[0].y + element.getHeight()) + '"/>';

    element.drawLine();
    expect(element.svg).toEqual(test);
  });

  // TESTS drawEllipse

  it('#drawEllipse devrait attribuer le bon svg si l\'option choisie n\'est pas \'Contour\'', () => {
    element.chosenOption = 'Vide';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + element.primaryColor
    + '" stroke="' + ((element.chosenOption !== 'Plein') ? element.secondaryColor : 'none')
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"/>';

    element.drawEllipse();
    expect(element.svg).toEqual(test);
  });

  it('#drawEllipse devrait attribuer le bon svg si l\'option choisie est \'Contour\'', () => {
    element.chosenOption = 'Contour';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + 'none'
    + '" stroke="' + ((element.chosenOption !== 'Plein') ? element.secondaryColor : 'none')
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"/>';

    element.drawEllipse();
    expect(element.svg).toEqual(test);
  });

  it('#drawEllipse devrait attribuer le bon svg si l\'option choisie n\'est pas \'Plein\'', () => {
    element.chosenOption = 'Vide';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + ((element.chosenOption !== 'Contour') ? element.primaryColor : 'none')
    + '" stroke="' + element.secondaryColor
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"/>';

    element.drawEllipse();
    expect(element.svg).toEqual(test);
  });

  it('#drawEllipse devrait attribuer le bon svg si l\'option choisie est \'Plein\'', () => {
    element.chosenOption = 'Plein';
    const test = '<ellipse transform=" translate(' + element.translate.x + ' ' + element.translate.y +
    ')" fill="' + ((element.chosenOption !== 'Contour') ? element.primaryColor : 'none')
    + '" stroke="' + 'none'
    + '" stroke-width="' + element.thickness
    + '" cx="' + (element.points[0].x + element.points[1].x) / 2 + '" cy="' + (element.points[0].y + element.points[1].y) / 2
    + '" rx="' + element.getWidth() / 2 + '" ry="' + element.getHeight() / 2 + '"/>';

    element.drawEllipse();
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
  + 'si Height et Width non nuls', () => {
    element.chosenOption = 'Vide';
    const thicknessTest = element.thickness;
    const test = '<rect stroke="gray" fill="none" stroke-width="2"'
    + ' x="' + (element.points[0].x - thicknessTest / 2)
    + '" y="' + (element.points[0].y - thicknessTest / 2)
    + '" height="' + (element.getHeight() + thicknessTest)
    + '" width="' + (element.getWidth() + thicknessTest) + '"/>';

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

  // TESTS updatePosition

  it('#updatePosition devrait attribuer les valeurs en paramètre à translation', () => {
    element.translate = {x: 90, y: 90};
    element.updatePosition(10, 10);
    expect(element.translate).toEqual({x: 100, y: 100});
  });

  it('#updatePosition devrait appeler la fonction draw', () => {
    spyOn(element, 'draw');
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse devrait attribuer les valeurs en paramètre à translation', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, {x: 10, y: 10});
    expect(element.translate).toEqual({x: 90, y: 90});
  });

  it('#updatePositionMouse devrait appeler la fonction draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, {x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updateParameters

  it('#updateParameters devrait attribuer les valeurs de l\'outil en paramètre à thickness s\'il en a une', () => {
    service.tools.toolList[8].parameters[0].value = 20;
    const test = service.tools.toolList[8].parameters[0].value;
    element.updateParameters(service.tools.toolList[8]);
    expect(element.thickness).toEqual(test);
  });

  it('#updateParameters devrait assigner 1 à thickness', () => {
    service.tools.toolList[8].parameters[0].value = 0;
    const testTool = service.tools.toolList[8];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(1);
  });

  it('#updateParameters devrait assigner chosenOption en paramètre à chosenOption', () => {
    service.tools.toolList[8].parameters[1].chosenOption = 'Point';
    const testTool = service.tools.toolList[8];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('Point');
  });

  it('#updateParameters devrait assigner une chaine de caractère vide à chosenOption', () => {
    service.tools.toolList[8].parameters[1].chosenOption = '';
    const testTool = service.tools.toolList[8];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });

  // TESTS translateAllPoints

  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
    element.points = [];
    element.points.push({x: 10, y: 10});
    element.translateAllPoints();
    expect(element.points[0].x).toEqual(20);
    expect(element.points[0].y).toEqual(20);
  });

  it('#translateAllPoints devrait mettre translation à 0', () => {
    element.translateAllPoints();
    expect(element.translate).toEqual({x: 0, y: 0});
  });
});
