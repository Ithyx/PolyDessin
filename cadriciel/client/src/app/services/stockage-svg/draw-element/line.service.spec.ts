import { TestBed } from '@angular/core/testing';
import { LineToolService } from '../../tools/line-tool.service';
import { LineService } from './line.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('LineService', () => {
  let element: LineService;
  let service: LineToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(LineToolService));

  beforeEach(() => {
    element = new LineService();
    element.updateParameters(service['tools'].toolList[5]);
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.thickness = 5;
    element.thicknessLine = 10;
    element.thicknessPoint = 20;
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 100, y: 100});
    element.chosenOption = 'Vide';
  });

  it('should be created', () => {
    const testService = TestBed.get(LineService);
    expect(testService).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait assigner un string polyline au SVG si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.erasingColor.RGBAString = 'rgba(255, 0, 0, 1)';
    const test = '<polyline transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" ' + 'fill="none"'
    + ' stroke="rgba(255, 0, 0, 1)" stroke-width="10" points="10 10 100 100 0 0"></polyline>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner un string polyline au SVG si isAPolygon est faux', () => {
    const test = '<polyline transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" ' + 'fill="none"'
    + ' stroke="rgba(0, 0, 0, 1)" stroke-width="10" points="10 10 100 100 0 0"></polyline>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner un string polygon au SVG si isAPolygon est vrai', () => {
    element.isAPolygon = true;
    const test = '<polygon transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" ' + 'fill="none"'
    + ' stroke="rgba(0, 0, 0, 1)" stroke-width="10" points="10 10 100 100 "></polygon>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner thicknessLine à thickness si chosenOption est \'Avec points\'', () => {
    element.chosenOption = 'Avec points';
    element.thicknessPoint = 0;
    const test = element.thicknessLine;
    element.draw();
    expect(element.thickness).toEqual(test);
  });

  it('#draw ne devrait pas assigner thicknessLine à thickness si chosenOption n\'est pas \'Avec points\'', () => {
    element.thicknessPoint = 0;
    const test = element.thickness;
    element.draw();
    expect(element.thickness).toEqual(test);
  });

  it('#draw devrait appeler la fonction drawPoints si chosenOption est \'Avec points\' ', () => {
    element.chosenOption = 'Avec points';
    spyOn(element, 'drawPoints');
    element.draw();
    expect(element.drawPoints).toHaveBeenCalled();
  });

  it('#draw devrait appeler la fonction drawPoints si chosenOption n\'est pas \'Avec points\' ', () => {
    spyOn(element, 'drawPoints');
    element.draw();
    expect(element.drawPoints).not.toHaveBeenCalled();
  });

  // TESTS drawPoints

  it('#drawPoints ne devrait pas modifier thickness si thicknessPoint est nul', () => {
      element.thicknessPoint = 0;
      const test = element.thickness;
      element.drawPoints();
      expect(element.thickness).toEqual(test);
    });

  it('#drawPoints devrait modifier thickness si thicknessPoint est non nul et deux fois plus grand que thickness', () => {
    const test = element.thicknessPoint * 2;
    element.drawPoints();
    expect(element.thickness).toEqual(test);
  });

  it('#drawPoints ne devrait pas modifier thickness si thicknessPoint est non nul mais pas deux fois plus grand que thickness', () => {
    element.thicknessPoint = 2;
    const test = element.thickness;
    element.drawPoints();
    expect(element.thickness).toEqual(test);
  });

  it('#drawPoints devrait assigner à fill primaryColor.RGBAString si erasingEvidence est faux', () => {
    element.svg = '';
    let test = element.svg;
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="' + 10 + '" cy="' + 10 + '" r="' + element.thicknessPoint  + '" fill="' + element.primaryColor.RGBAString + '"></circle>';
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="' + 100 + '" cy="' + 100 + '" r="' + element.thicknessPoint  + '" fill="' + element.primaryColor.RGBAString + '"></circle>';
    element.drawPoints();
    expect(element.svg).toEqual(test);
  });

  it('#drawPoints devrait assigner à fill erasingColor.RGBAString si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.svg = '';
    let test = element.svg;
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="' + 10 + '" cy="' + 10 + '" r="' + element.thicknessPoint  + '" fill="' + element.erasingColor.RGBAString + '"></circle>';
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="' + 100 + '" cy="' + 100 + '" r="' + element.thicknessPoint  + '" fill="' + element.erasingColor.RGBAString + '"></circle>';
    element.drawPoints();
    expect(element.svg).toEqual(test);
  });

  // TESTS isEmpty

  it('#isEmpty devrait retourner vrai si le conteneur points est vide', () => {
    element.points = [];
    const test = element.isEmpty();
    expect(test).toBe(true);
  });

  it('#isEmpty devrait retourner vrai si le conteneur points contient un élément avec chosenOption à \'Sans points\'', () => {
    element.points.pop();
    element.chosenOption = 'Sans points';
    const test = element.isEmpty();
    expect(test).toBe(true);
  });

  it('#isEmpty devrait retourner vrai si le conteneur points est vide avec chosenOption à \'Sans points\'', () => {
    element.points = [];
    element.chosenOption = 'Sans points';
    const test = element.isEmpty();
    expect(test).toBe(true);
  });

  it('#isEmpty devrait retourner faux si le conteneur points contient un élément avec chosenOption pas à \'Sans points\'', () => {
    element.points.pop();
    const test = element.isEmpty();
    expect(test).toBe(false);
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à thicknessLine', () => {
    service['tools'].toolList[5].parameters[0].value = 10;
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessLine).toEqual(service['tools'].toolList[5].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à thicknessLine', () => {
    service['tools'].toolList[5].parameters[0].value = 0;
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessLine).toEqual(1);
  });

  it('#updateParameters devrait assigner la chaine de caractères en paramètre à thicknessLine', () => {
    service['tools'].toolList[5].parameters[1].chosenOption = 'test';
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual(service['tools'].toolList[5].parameters[1].chosenOption);
  });

  it('#updateParameters devrait assigner une chaine de caratères vide à thickness', () => {
    service['tools'].toolList[5].parameters[1].chosenOption = '';
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });

  it('#updateParameters devrait assigner la valeur en paramètre à thicknessPoint', () => {
    service['tools'].toolList[5].parameters[2].value = 10;
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessPoint).toEqual(service['tools'].toolList[5].parameters[2].value);
  });

  it('#updateParameters devrait assigner 1 à thicknessPoint', () => {
    service['tools'].toolList[5].parameters[2].value = 0;
    const testTool = service['tools'].toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessPoint).toEqual(1);
  });

});
