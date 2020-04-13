import { TestBed } from '@angular/core/testing';
import { ColorFillService } from './color-fill.service';
import { PaintBucketToolService } from '../../tools/paint-bucket-tool.service';

// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

describe('ColorFillService', () => {
  let service: PaintBucketToolService;
  let element: ColorFillService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(PaintBucketToolService));

  beforeEach(() => {
    element = new ColorFillService();
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.translate = { x: 10, y: 10};
    element.points.push({ x: 10, y: 10});
    element.points.push({ x: 100, y: 100});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait assigner un string path au SVG si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    element.erasingColor.RGBAString = 'rgba(255, 0, 0, 1)';
    const test = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + 'stroke="' + element.erasingColor.RGBAString + '" '
    + 'stroke-width="3" d="M 10 10 L 100 100 ' + '"></path>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner un string path au SVG si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.erasingColor.RGBAString = 'rgba(255, 0, 0, 1)';
    const test = '<path transform="translate(' + element.translate.x + ' ' + element.translate.y + ')" fill="none" '
    + 'stroke="' + element.primaryColor.RGBAString + '" '
    + 'stroke-width="3" d="M 10 10 L 100 100 ' + '"></path>';
    element.draw();
    expect(element.svg).toEqual(test);
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

  it('#updateParameters ne devrait rien faire', () => {
    element.updateParameters();
    expect().nothing();
  });
});
