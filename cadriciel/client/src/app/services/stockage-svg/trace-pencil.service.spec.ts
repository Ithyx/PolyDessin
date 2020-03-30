import { TestBed } from '@angular/core/testing';
import { PencilToolService } from '../tools/pencil-tool.service';
import { TracePencilService } from './trace-pencil.service';

// tslint:disable: no-string-literal
// tslint:disable:no-magic-numbers

describe('TracePencilService', () => {
  let element: TracePencilService;
  let service: PencilToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(PencilToolService));

  beforeEach(() => {
    element = new TracePencilService();
    element.updateParameters(service['tools'].toolList[0]);
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.thickness = 5;
    element.translate = { x: 10, y: 10};
  });

  it('should be created', () => {
    const testService: TracePencilService = TestBed.get(TracePencilService);
    expect(testService).toBeTruthy();
  });

  // TESTS drawPath

  it('#drawPath devrait mettre la translation dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.translate = { x: 20, y: 20};
    element.svg = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + `stroke="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"`
    + ' stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre la primaryColor dans SVG si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.primaryColor.RGBAString = '"rgba(1, 1, 1, 1)"';
    element.svg = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + 'stroke="' + element.primaryColor.RGBAString
    + '" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre la erasingColor dans SVG si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.svg = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + 'stroke="' + element.erasingColor.RGBAString
    + '" stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPath devrait  mettre le thickness dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 10, y: 10});
    element.thickness = 25;
    element.svg = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + `stroke="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"`
    + ' stroke-linecap="round" stroke-width="' + element.thickness + '" d="M 10 10 L 10 10 L 10 10 "></path>';
    const testSVG = element.svg;
    element.drawPath();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS drawPoint

  it('#drawPoint devrait mettre un point dans SVG', () => {
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" r="' + element.thickness / 2
    + '" fill="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString) + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre le thickness / 2 dans SVG', () => {
    element.thickness = 20;
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" r="' + 10
    + '" fill="' + ((element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString) + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre primaryColor dans SVG si erasingEvidence est faux', () => {
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.primaryColor.RGBAString + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  it('#drawPoint devrait mettre erasingColor dans SVG si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.primaryColor.RGBAString = 'rgba(1, 1, 1, 1)';
    element.points.push({ x: 10, y: 10});
    element.svg = '<circle cx="' + element.points[0].x + '" cy="' + element.points[0].y
    + '" transform=" translate(' + element.translate.x + ' ' + element.translate.y
    + ')" r="' + element.thickness / 2
    + '" fill="' + element.erasingColor.RGBAString + '"></circle>';
    const testSVG = element.svg;
    element.drawPoint();
    expect(element.svg).toEqual(testSVG);
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à thickness', () => {
    service['tools'].toolList[0].parameters[0].value = 10;
    const testTool = service['tools'].toolList[0];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(service['tools'].toolList[0].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à thickness', () => {
    service['tools'].toolList[0].parameters[0].value = 0;
    const testTool = service['tools'].toolList[0];
    element.updateParameters(testTool);
    expect(element.thickness).toEqual(1);
  });
});
