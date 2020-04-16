import { TestBed } from '@angular/core/testing';
import { BrushToolService } from '../../../tools/tracing-tool/brush-tool.service';
import { TraceBrushService } from './trace-brush.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('trace-brush', () => {
  let element: TraceBrushService;
  let service: BrushToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(BrushToolService));

  beforeEach(() => {
    element = new TraceBrushService();
    element.updateParameters(service['tools'].toolList[1]);
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.thickness = 5;
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
  });

  it('should be created', () => {
    const testService: TraceBrushService = TestBed.get(TraceBrushService);
    expect(testService).toBeTruthy();
  });

  // TESTS drawPath

  it('#drawPath devrait  mettre la primaryColor dans SVG si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.svg = '<path transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" fill="none" '
    + 'stroke="' + element.primaryColor.RGBAString
    + '" filter="url(#' + element.chosenOption
    + ')" stroke-linejoin="round" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre la erasingColor dans SVG si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.erasingColor.RGBAString = '"rgba(1, 1, 1, 1)"';
    element.svg = '<path transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" fill="none" '
    + 'stroke="' + element.erasingColor.RGBAString
    + '" filter="url(#' + element.chosenOption
    + ')" stroke-linejoin="round" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre le thickness dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.thickness = 25;
    element.svg = '<path transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" fill="none" '
    + `stroke="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"`
    + ' filter="url(#' + element.chosenOption
    + ')" stroke-linejoin="round" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS drawPoint

  it('#drawPoint devrait mettre un point dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
                                + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString) + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre le thickness / 2 dans SVG', () => {
    element.thickness = 24;
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
                                + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + 12
    + '" fill="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString) + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre primaryColor dans SVG si erasingEvidence faux', () => {
    element.erasingEvidence = false;
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
                                + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.primaryColor.RGBAString + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre erasingColor dans SVG si erasingEvidence vrai', () => {
    element.erasingEvidence = true;
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
                                + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" filter="url(#' + element.chosenOption
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.erasingColor.RGBAString + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à thickness', () => {
    service['tools'].toolList[1].parameters[0].value = 10;
    const testTool = service['tools'].toolList[1];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(service['tools'].toolList[1].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à thickness', () => {
    service['tools'].toolList[1].parameters[0].value = 0;
    const testTool = service['tools'].toolList[1];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(1);
  });

  it('#updateParameters devrait assigner chosenOption en paramètre à chosenOption', () => {
    service['tools'].toolList[1].parameters[1].chosenOption = 'Flou';
    const testTool = service['tools'].toolList[1];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('Flou');
  });

  it('#updateParameters devrait assigner une chaine de caractère vide à chosenOption', () => {
    service['tools'].toolList[1].parameters[1].chosenOption = '';
    const testTool = service['tools'].toolList[1];
    element.updateParameters(testTool);
    expect(element.chosenOption).toEqual('');
  });
});
