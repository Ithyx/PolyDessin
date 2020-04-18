import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { ExportParams, ExportService } from './export.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ExportService', () => {
  let drawing: Drawing;
  let service: ExportService;
  let context: CanvasRenderingContext2D;
  let element: DrawElement;
  let params: ExportParams;
  let canvas: HTMLCanvasElement;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));
  beforeEach(() => service = TestBed.get(ExportService));
  beforeEach(() => {
    canvas = document.createElement('canvas');
    const contextCanvas = canvas.getContext('2d');
    if (contextCanvas) {
      context = contextCanvas;
    }
    service['canvas'] = canvas;
    service['context'] = context;
    service['container'] = document.createElement('a');
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
  beforeEach(() => params = {
    element: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    selectedExportFormat: '',
    container: document.createElement('a'),
    selectedAuthor: '',
    selectedFileName: '',
    emailAdress: '',
    isEmail: false
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

  // TESTS export
  it('#export ne devrait pas construire de nouvelle image si le canvas est invalide', () => {
    service['canvas'] = canvas;
    spyOn(service['canvas'], 'getContext').and.returnValue(null);
    const spy = spyOn(URL, 'createObjectURL');
    service.export(params);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#export devrait construire une nouvelle image si le canvas est valide', () => {
    service['canvas'] = canvas;
    const spy = spyOn(URL, 'createObjectURL');
    service.export(params);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS downloadImage

  it('#downloadImage devrait appeler drawImage du context', () => {
    const spy = spyOn(service['context'], 'drawImage');
    service['downloadImage']();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS sendImage
});
