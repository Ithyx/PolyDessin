import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { ExportService } from './export.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ExportService', () => {
  let drawing: Drawing;
  let service: ExportService;
  let context: CanvasRenderingContext2D;
  let element: DrawElement;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));
  beforeEach(() => service = TestBed.get(ExportService));
  beforeEach(() => {
    const canvas = document.createElement('canvas');
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
    }
  });
  beforeEach(() => drawing = {
    _id: 0,
    name: 'test',
    height: 100,
    width: 100,
    backgroundColor: {RGBA: [0, 0, 0, 1], RGBAString: ''}
  });
  beforeEach(() => element = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updateRotation: () => { return; },
    updateScale: () => { return; },
    calculateRotation: () => { return; },
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
    updateParameters: () => { return; }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS de generateSVG
  it('#generateSVG devrait include la bonne taille et les bonne méta données', () => {
    const headers = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${100}" height="${100}">\n`;
    expect(service['generateSVG'](drawing, '').includes(headers)).toBe(true);
  });
  it('#generateSVG devrait avoir une balise g si le dessin possède des éléments', () => {
    drawing.elements = [element, element];
    expect(service['generateSVG'](drawing, '').includes('<g>')).toBe(true);
  });
  it('#generateSVG devrait avoir une balise text si le dessin est signé par un auteur non vide', () => {
    drawing.elements = [element, element];
    expect(service['generateSVG'](drawing, 'auteur').includes('</text>')).toBe(true);
  });
  it('#generateSVG ne devrait pas avoir de balise text si le dessin est signé par un auteur vide', () => {
    drawing.elements = [element, element];
    expect(service['generateSVG'](drawing, '').includes('</text>')).toBe(false);
  });

  // TESTS drawAuthorCanvas

  it('#drawAuthorCanvas devrait modifier le style du context pour le nom d\'auteur', () => {
    service['drawAuthorCanvas'](context, '', 500);
    expect(context.font).toEqual('30px Arial');
    expect(context.strokeStyle).toEqual('#ffffff');
    expect(context.lineWidth).toEqual(3);
  });

  it('#drawAuthorCanvas devrait appeler strokeText du context', () => {
    const spy = spyOn(context, 'strokeText');
    const authorName = '';
    service['drawAuthorCanvas'](context, authorName, 500);
    expect(spy).toHaveBeenCalledWith(`auteur: ${authorName}`, 0, 495);
  });

  it('#drawAuthorCanvas devrait appeler strokeText du context', () => {
    const spy = spyOn(context, 'fillText');
    const authorName = '';
    service['drawAuthorCanvas'](context, authorName, 500);
    expect(spy).toHaveBeenCalledWith(`auteur: ${authorName}`, 0, 495);
  });
});
