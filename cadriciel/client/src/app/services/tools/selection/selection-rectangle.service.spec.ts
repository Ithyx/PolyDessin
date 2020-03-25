/* import { TestBed } from '@angular/core/testing';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Color } from '../../stockage-svg/draw-element';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { SelectionRectangleService } from './selection-rectangle.service';

// tslint:disable: no-magic-numbers

describe('SelectionRectangleService', () => {
  let service: SelectionRectangleService;
  let sanitizer: DomSanitizer;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionRectangleService));
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));

  it('should be created', () => {
    const testService: SelectionRectangleService = TestBed.get(SelectionRectangleService);
    expect(testService).toBeTruthy();
  });

  // Tests refreshSVG

  it('#refreshSVG devrait avoir la couleur principal à rgba(0, 80, 130, 0.35)', () => {
    service.rectangle = new RectangleService();
    service.refreshSVG();
    const color: Color = {
      RGBAString: 'rgba(0, 80, 130, 0.35)',
      RGBA: [0, 80, 130, 0.35]
    };
    expect(service.rectangle.primaryColor).toBe(color);
  });

  it('#refreshSVG devrait avoir la couleur secondaire à rgba(80, 80, 80, 0.45)', () => {
    service.rectangle = new RectangleService();
    service.refreshSVG();
    const color: Color = {
      RGBAString: 'rgba(80, 80, 80, 0.45)',
      RGBA: [80, 80, 80, 0.45]
    };
    expect(service.rectangle.secondaryColor).toBe(color);
  });

  it('#refreshSVG devrait dessiner le nouveau rectange de selection', () => {
    service.rectangle = new RectangleService();
    spyOn(service.rectangle, 'draw');
    service.refreshSVG();
    expect(service.rectangle.draw).toHaveBeenCalled();
  });

  it('#refreshSVG devrait convertir le SVG du rectangle en HTML', () => {
    service.rectangle = new RectangleService();
    service.rectangle.svg = '<line stroke-linecap="square" stroke="rgba(80, 80, 80, 0.45)" stroke-width="3" x1="0" y1="0" x2="0" y2="0"/>';
    service.refreshSVG();
    const testHTML: SafeHtml = sanitizer.bypassSecurityTrustHtml(service.rectangle.svg);
    expect(service.rectangle.svgHtml).toEqual(testHTML);
  });

  // Tests mouseMove

  it('#mouseMove ne devrait rien faire si il n\'y a pas de selection en cours', () => {
    const mouse = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.ongoingSelection = false;
    spyOn(service, 'refreshSVG');
    service.mouseMove(mouse);
    expect(service.refreshSVG).not.toHaveBeenCalled();
  });

  // Tests mouseDown

  it('#mouseDown devrait créer un nouveau rectangleService', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const initRectangle = new RectangleService();
    initRectangle.isDotted = true;
    service.mouseDown(mouse);
    expect(service.rectangle).toEqual(initRectangle);
  });

  it('#mouseDown, le rectangle créé devrait être en pointillé', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.mouseDown(mouse);
    expect(service.rectangle.isDotted).toBe(true);
  });

  it('#mouseDown devrait donner à un initialPoint les coordonnées de la souris', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const mousePoint: Point = {x: mouse.offsetX, y: mouse.offsetY};
    service.mouseDown(mouse);
    expect(service.initialPoint).toEqual(mousePoint);
  });

  it('#mouseDown devrait mettre ongoingSelection à true', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.mouseDown(mouse);
    expect(service.ongoingSelection).toBe(true);
  });

  // Tests mouseUp

  it('#mouseUp devrait mettre basisPoint à {0,0}', () => {
    const nullPoint: Point = {x: 0, y: 0};
    service.mouseUp();
    expect(service.basisPoint).toEqual(nullPoint);
  });

  it('#mouseUp devrait mettre widthCalculated à 0', () => {
    service.mouseUp();
    expect(service.widthCalculated).toBe(0);
  });

  it('#mouseUp devrait mettre heightCalculated à 0', () => {
    service.mouseUp();
    expect(service.heightCalculated).toBe(0);
  });

  it('#mouseUp devrait mettre ongoingSelection à false', () => {
    service.mouseUp();
    expect(service.ongoingSelection).toBe(false);
  });
}); */
