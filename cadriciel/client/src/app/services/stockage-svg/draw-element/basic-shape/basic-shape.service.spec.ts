import { TestBed } from '@angular/core/testing';
import { TOOL_INDEX } from 'src/app/services/tools/tool-manager.service';
import { BasicShapeToolService } from '../../../tools/basic-shape-tool/basic-shape-tool.service';
import { RectangleToolService } from '../../../tools/basic-shape-tool/rectangle-tool.service';
import { BasicShapeService } from './basic-shape.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal

describe('BasicShapeService', () => {
  let service: BasicShapeToolService;
  let element: BasicShapeService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(RectangleToolService));

  beforeEach(() => {
    element = new RectangleService();
    element.updateParameters(service['tools'].toolList[3]);
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
    const testService: RectangleService = TestBed.get(RectangleService);
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

  it('#draw devrait appeler drawShape() en ne satisfaisant pas les conditions pour avec chosenOption à \'Plein\'', () => {
    element.points[0].x = 0;
    element.points[1].x = 0;
    element.points[0].y = 0;
    element.points[1].y = 0;
    element.chosenOption = 'Plein';
    spyOn(element, 'drawShape');
    element.draw();
    expect(element.drawShape).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawStroke si l\'option choisie n\'est pas "Plein"', () => {
    element.chosenOption = 'Contour';
    const spy = spyOn(element, 'drawStroke');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawStroke si erasingEvidence est true', () => {
    element.erasingEvidence = true;
    const spy = spyOn(element, 'drawStroke');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });

  it('#draw ne devrait pas appeler drawStroke si l\'option choisie est "Plein" et erasingEvidence est false', () => {
    element.chosenOption = 'Plein';
    element.erasingEvidence = false;
    const spy = spyOn(element, 'drawStroke');
    element.draw();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#draw devrait appeler drawPerimeter', () => {
    spyOn(element, 'drawPerimeter');
    element.draw();
    expect(element.drawPerimeter).toHaveBeenCalled();
  });

  // TESTS drawStroke

  it('#drawStroke devrait mettre stroke-linejoin du svg à round si le drawElement est une ellipse', () => {
    element.trueType = TOOL_INDEX.ELLIPSE;
    element.drawStroke();
    expect(element.svg.includes('stroke-linejoin="round')).toBe(true);
  });

  it('#drawStroke devrait mettre un contour en pointillé si isDotted est vrai', () => {
    element.isDotted = true;
    element.drawStroke();
    expect(element.svg.includes('"stroke-dasharray="4, 4"')).toBe(true);
  });

  it('#drawStroke devrait utiliser erasingColor si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.erasingColor = {
      RGBAString: 'rgba(99, 99, 99, 1)',
      RGBA: [99, 99, 99, 1]
    };
    element.drawStroke();
    expect(element.svg.includes('rgba(99, 99, 99, 1)')).toBe(true);
  });

  // TESTS updateParameters

  it('#updateParameters devrait attribuer les valeurs de l\'outil en paramètre à thickness s\'il en a une', () => {
    service['tools'].toolList[3].parameters[0].value = 20;
    const test = service['tools'].toolList[3].parameters[0].value;
    element.updateParameters(service['tools'].toolList[3]);
    expect(element.thickness).toEqual(test);
  });

  it('#updateParameters devrait assigner 1 à thickness', () => {
    service['tools'].toolList[3].parameters[0].value = 0;
    const testTool = service['tools'].toolList[3];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(1);
  });

  it('#updateParameters devrait assigner chosenOption en paramètre à chosenOption', () => {
    service['tools'].toolList[3].parameters[1].chosenOption = 'Point';
    const testTool = service['tools'].toolList[3];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('Point');
  });

  it('#updateParameters devrait assigner une chaine de caractère vide à chosenOption', () => {
    service['tools'].toolList[3].parameters[1].chosenOption = '';
    const testTool = service['tools'].toolList[3];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });
});
