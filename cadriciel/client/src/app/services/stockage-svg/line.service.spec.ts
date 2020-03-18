import { TestBed } from '@angular/core/testing';
import { DrawingToolService } from '../tools/pencil-tool.service';
import { LineService } from './line.service';

// tslint:disable:no-magic-numbers

describe('LineService', () => {
  let element: LineService;
  let service: DrawingToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DrawingToolService));

  beforeEach(() => {
    element = new LineService();
    element.updateParameters(service.tools.toolList[5]);
    element.primaryColor = 'rgba(0, 0, 0, 1)';
    element.thickness = 5;
    element.thicknessLine = 10;
    element.thicknessPoint = 20;
    element.translate = { x: 10, y: 10};
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 100, y: 100});
    element.chosenOption = 'Vide';
  });

  it('should be created', () => {
    const testService = TestBed.get(LineService);
    expect(testService).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait assigner un string polyline au SVG si isAPolygon est faux', () => {
    const test = '<polyline '
    + ' transform ="translate(' + element.translate.x + ' ' + element.translate.y + ')"'
    + 'fill="none" stroke="' + element.primaryColor + '" stroke-width="' + element.thicknessLine
    + '" points="10 10 100 100 '
    + element.mousePosition.x + ' ' + element.mousePosition.y + '" />';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner un string polygon au SVG si isAPolygon est vrai', () => {
    element.isAPolygon = true;
    const test = '<polygon '
    + ' transform ="translate(' + element.translate.x + ' ' + element.translate.y + ')"'
    + 'fill="none" stroke="' + element.primaryColor + '" stroke-width="' + element.thicknessLine
    + '" points="10 10 100 100 ' + '" />';
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

  it('#drawPoints devrait assigner à svg', () => {
    element.svg = 'test';
    let test = element.svg;
    test += '<circle transform ="translate(' + element.translate.x + ' ' + element.translate.y
    + ')"cx="' + 10 + '" cy="' + 10 + '" r="' + element.thicknessPoint  + '" fill="' + element.primaryColor + '"/>';
    test += '<circle transform ="translate(' + element.translate.x + ' ' + element.translate.y
    + ')"cx="' + 100 + '" cy="' + 100 + '" r="' + element.thicknessPoint  + '" fill="' + element.primaryColor + '"/>';
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

  // TESTS updatePosition

  it('#updatePosition devrait ajouter les valeurs en paramètre à translate', () => {
    element.updatePosition(10, -25);
    expect(element.translate.x).toEqual(20);
    expect(element.translate.y).toEqual(-15);
  });

  it('#updatePosition devrait appeler draw', () => {
    spyOn(element, 'draw');
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse devrait ajouter les valeurs en paramètre à translate', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.translate.x).toEqual(90);
    expect(element.translate.y).toEqual(90);
  });

  it('#updatePositionMouse devrait appeler draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à thicknessLine', () => {
    service.tools.toolList[5].parameters[0].value = 10;
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessLine).toEqual(service.tools.toolList[5].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à thicknessLine', () => {
    service.tools.toolList[5].parameters[0].value = 0;
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessLine).toEqual(1);
  });

  it('#updateParameters devrait assigner la chaine de caractères en paramètre à thicknessLine', () => {
    service.tools.toolList[5].parameters[1].chosenOption = 'test';
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual(service.tools.toolList[5].parameters[1].chosenOption);
  });

  it('#updateParameters devrait assigner une chaine de caratères vide à thickness', () => {
    service.tools.toolList[5].parameters[1].chosenOption = '';
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });

  it('#updateParameters devrait assigner la valeur en paramètre à thicknessPoint', () => {
    service.tools.toolList[5].parameters[2].value = 10;
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessPoint).toEqual(service.tools.toolList[5].parameters[2].value);
  });

  it('#updateParameters devrait assigner 1 à thicknessPoint', () => {
    service.tools.toolList[5].parameters[2].value = 0;
    const testTool = service.tools.toolList[5];
    element.updateParameters(testTool);
    expect(element.thicknessPoint).toEqual(1);
  });

  // TESTS translateAllPoints

  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
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
