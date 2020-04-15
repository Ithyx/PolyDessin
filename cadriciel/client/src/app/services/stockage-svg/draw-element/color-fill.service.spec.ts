import { TestBed } from '@angular/core/testing';
import { PaintBucketToolService } from '../../tools/paint-bucket-tool.service';
import { ColorFillService } from './color-fill.service';

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
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
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
    const test = '<path transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" fill="none" '
    + 'stroke="' + element.erasingColor.RGBAString + '" '
    + 'stroke-width="3" d="M 10 10 L 100 100 ' + '"></path>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait assigner un string path au SVG si erasingEvidence est faux', () => {
    element.erasingEvidence = false;
    element.erasingColor.RGBAString = 'rgba(255, 0, 0, 1)';
    const test = '<path transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f + ')" fill="none" '
    + 'stroke="' + element.primaryColor.RGBAString + '" '
    + 'stroke-width="3" d="M 10 10 L 100 100 ' + '"></path>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  // TESTS updateParameters

  it('#updateParameters ne devrait rien faire', () => {
    element.updateParameters();
    expect().nothing();
  });
});
