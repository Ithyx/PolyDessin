import { TestBed } from '@angular/core/testing';

import { EllipseService } from '../stockage-svg/draw-element/basic-shape/ellipse.service';
import { PolygonService } from '../stockage-svg/draw-element/basic-shape/polygon.service';
import { RectangleService } from '../stockage-svg/draw-element/basic-shape/rectangle.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SprayService } from '../stockage-svg/draw-element/spray.service';
import { TraceBrushService } from '../stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { TOOL_INDEX } from '../tools/tool-manager.service';
import { SavingUtilityService } from './saving-utility.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SavingUtilityService', () => {
  let service: SavingUtilityService;
  const elementBackup: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [],
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updateParameters: () => { return; },
    updateRotation: () => { return; },
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
  };
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => element = elementBackup);
  beforeEach(() => service = TestBed.get(SavingUtilityService));

  it('should be created', () => {
    const testService: SavingUtilityService = TestBed.get(SavingUtilityService);
    expect(testService).toBeTruthy();
  });

  // TESTS createCopyDrawElement

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (TracePencilService)' +
  ' et l\'élément à copier', () => {
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new TracePencilService(), element);
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (TraceBrushService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.BRUSH;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new TraceBrushService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (SprayService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.SPRAY;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new SprayService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (RectangleService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.RECTANGLE;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new RectangleService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (PolygonService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.POLYGON;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new PolygonService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (LineService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.LINE;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    const line = new LineService();
    line.mousePosition = (element as LineService).mousePosition;
    expect(spy).toHaveBeenCalledWith(line, element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (EllipseService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.ELLIPSE;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new EllipseService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du bon type (ColorFillService)' +
  ' et l\'élément à copier', () => {
    element.trueType = TOOL_INDEX.PAINT_BUCKET;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new ColorFillService(), element);
    element.trueType = 0;
  });

  it('#createCopyDrawElement devrait appeler setupCopy avec un un nouvelle élément du type TracePencilService' +
  'si le trueType de l\'élément ne correspond à rien et l\'élément à copier', () => {
    element.trueType = 99;
    const spy = spyOn(service, 'setupCopy');
    service.createCopyDrawElement(element);
    expect(spy).toHaveBeenCalledWith(new TracePencilService(), element);
    element.trueType = 0;
  });

  // TESTS setupCopy

  it('#setupCopy devrait faire une copie exacte de l\'ancien élément', () => {
    element.primaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.secondaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.thickness = 0;
    element.thicknessLine = 0;
    element.thicknessPoint = 0;
    element.texture = '';
    element.perimeter = '';
    element.isAPoint = false;
    element.isDotted = false;
    element.chosenOption = '';
    element.isAPolygon = false;
    const newElement = elementBackup;
    expect(service.setupCopy(newElement, element)).toEqual(element);
  });
  it('#setupCopy devrait faire une copie exacte de l\'ancien élément même si des attributs sont undefined', () => {
    element.primaryColor = undefined;
    element.secondaryColor = undefined;
    element.thickness = undefined;
    element.thicknessLine = undefined;
    element.thicknessPoint = undefined;
    element.texture = undefined;
    element.perimeter = undefined;
    element.isAPoint = undefined;
    element.isDotted = undefined;
    element.chosenOption = undefined;
    element.isAPolygon = undefined;
    const newElement = elementBackup;
    expect(service.setupCopy(newElement, element)).toEqual(element);
  });
});
