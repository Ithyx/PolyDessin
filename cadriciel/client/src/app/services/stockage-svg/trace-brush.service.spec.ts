import { TestBed } from '@angular/core/testing';

import { DrawingToolService } from '../tools/pencil-tool.service';
import { TraceBrushService } from './trace-brush.service';

describe('trace-brush', () => {
  let element: TraceBrushService;
  let service: DrawingToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(DrawingToolService));

  beforeEach(() => {
    element = new TraceBrushService();
    element.updateParameters(service.tools.toolList[1]);
    element.primaryColor = 'rgba(0, 0, 0, 1)';
    // tslint:disable-next-line:no-magic-numbers
    element.thickness = 5;
    element.translate = { x: 10, y: 10};
  });

  it('should be created', () => {
    const testService: TraceBrushService = TestBed.get(TraceBrushService);
    expect(testService).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait appeler drawPoint si isAPoint est vrai', () => {
    spyOn(element, 'drawPoint');
    element.isAPoint = true;
    element.draw();
    expect(element.drawPoint).toHaveBeenCalled();
  });

  it('#draw devrait appeler drawPath si isAPoint est faux', () => {
    spyOn(element, 'drawPath');
    element.draw();
    expect(element.drawPath).toHaveBeenCalled();
  });

  // TESTS drawPath

  it('#drawPath devrait mettre la translation dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.translate = { x: 20, y: 20};
    element.svg = '<path transform ="translate(' + element.translate.x + ' '
    + element.translate.y + `)" fill="none" stroke="${element.primaryColor}"`
    + ' filter="url(#' + element.chosenOption
    + ')" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 " />';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre la primaryColor dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.primaryColor = 'rgba(1, 1, 1, 1)';
    element.svg = '<path transform ="translate(' + element.translate.x + ' '
    + element.translate.y + `)" fill="none" stroke="${element.primaryColor}"`
    + ' filter="url(#' + element.chosenOption
    + ')" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 " />';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre le thickness dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    // tslint:disable-next-line:no-magic-numbers
    element.thickness = 25;
    element.svg = '<path transform ="translate(' + element.translate.x + ' '
    + element.translate.y + `)" fill="none" stroke="${element.primaryColor}"`
    + ' filter="url(#' + element.chosenOption
    + ')" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 " />';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS drawPoint

  it('#drawPoint devrait mettre un point dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.primaryColor + '"/>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre le thickness / 2 dans SVG', () => {
    // tslint:disable-next-line:no-magic-numbers
    element.thickness = 25;
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.primaryColor + '"/>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre primaryColor dans SVG', () => {
    element.primaryColor = 'rgba(1, 1, 1, 1)';
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.primaryColor + '"/>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS updatePosition

  it('#updatePosition devrait ajouter les valeurs en paramètre à translate', () => {
    // tslint:disable-next-line:no-magic-numbers
    element.updatePosition(10, -25);
    // tslint:disable-next-line:no-magic-numbers
    expect(element.translate.x).toEqual(20);
    // tslint:disable-next-line:no-magic-numbers
    expect(element.translate.y).toEqual(-15);
  });

  it('#updatePosition devrait appeler draw', () => {
    spyOn(element, 'draw');
    // tslint:disable-next-line:no-magic-numbers
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse devrait ajouter les valeurs en paramètre à translate', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    // tslint:disable-next-line:no-magic-numbers
    element.updatePositionMouse(click, { x: 10, y: 10});
    // tslint:disable-next-line:no-magic-numbers
    expect(element.translate.x).toEqual(90);
    // tslint:disable-next-line:no-magic-numbers
    expect(element.translate.y).toEqual(90);
  });

  it('#updatePositionMouse devrait appeler draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    // tslint:disable-next-line:no-magic-numbers
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à thickness', () => {
    // tslint:disable-next-line: no-magic-numbers
    service.tools.toolList[1].parameters[0].value = 10;
    const testTool = service.tools.toolList[1];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(service.tools.toolList[1].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à thickness', () => {
    service.tools.toolList[1].parameters[0].value = 0;
    const testTool = service.tools.toolList[1];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(1);
  });

  it('#updateParameters devrait assigner chosenOption en paramètre à chosenOption', () => {
    service.tools.toolList[1].parameters[1].chosenOption = 'Flou';
    const testTool = service.tools.toolList[1];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('Flou');
  });

  it('#updateParameters devrait assigner une chaine de caractère vide à chosenOption', () => {
    service.tools.toolList[1].parameters[1].chosenOption = '';
    const testTool = service.tools.toolList[1];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });

  // TESTS translateAllPoints

  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
    element.points.push({x: 10, y: 10});
    element.translateAllPoints();
    // tslint:disable-next-line:no-magic-numbers
    expect(element.points[0].x).toEqual(20);
    // tslint:disable-next-line:no-magic-numbers
    expect(element.points[0].y).toEqual(20);
  });

  it('#translateAllPoints devrait mettre translation à 0', () => {
    element.translateAllPoints();
    // tslint:disable-next-line:no-magic-numbers
    expect(element.translate).toEqual({x: 0, y: 0});
  });
});
