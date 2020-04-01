import { TestBed } from '@angular/core/testing';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Point } from '../../stockage-svg/draw-element';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { rectangleSelectionTool, SelectionRectangleService } from './selection-rectangle.service';
import { LEFT_CLICK, RIGHT_CLICK } from './selection.service';

// tslint:disable: no-magic-numbers
// tslint:disable:no-string-literal

describe('SelectionRectangleService', () => {
  let service: SelectionRectangleService;
  let sanitizer: DomSanitizer;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionRectangleService));
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));

  beforeEach(() => {
    service['initialPoint'] = {x: 1000 , y: 1000};
    service['basisPoint'] = {x: 1000 , y: 1000};
    service.rectangle = new RectangleService();
    service.rectangleInverted = new RectangleService();
    service.ongoingSelection = true;
  });

  it('should be created', () => {
    const testService: SelectionRectangleService = TestBed.get(SelectionRectangleService);
    expect(testService).toBeTruthy();
  });

  // Tests refreshSVGNormalSelection

  it('#refreshSVGNormalSelection devrait appeler updateParameters', () => {
    service.rectangle = new RectangleService();
    spyOn(service.rectangle, 'updateParameters');
    service.refreshSVGNormalSelection();
    expect(service.rectangle.updateParameters).toHaveBeenCalledWith(rectangleSelectionTool);
  });

  it('#refreshSVGNormalSelection devrait avoir la couleur principal à rgba(0, 80, 130, 0.35)', () => {
    service.rectangle = new RectangleService();
    service.refreshSVGNormalSelection();
    const color = 'rgba(0, 80, 130, 0.35)';
    expect(service.rectangle.primaryColor.RGBAString).toEqual(color);
  });

  it('#refreshSVGNormalSelection devrait avoir la couleur secondaire à rgba(80, 80, 80, 0.45)', () => {
    service.rectangle = new RectangleService();
    service.refreshSVGNormalSelection();
    const color = 'rgba(80, 80, 80, 0.45)';
    expect(service.rectangle.secondaryColor.RGBAString).toEqual(color);
  });

  it('#refreshSVGNormalSelection devrait dessiner le nouveau rectange de selection', () => {
    service.rectangle = new RectangleService();
    spyOn(service.rectangle, 'draw');
    service.refreshSVGNormalSelection();
    expect(service.rectangle.draw).toHaveBeenCalled();
  });

  it('#refreshSVGNormalSelection devrait convertir le SVG du rectangle en HTML', () => {
    service.rectangle = new RectangleService();
    service.rectangle.svg = '<line stroke-linecap="square" stroke="rgba(80, 80, 80, 0.45)" stroke-width="3" x1="0" y1="0" x2="0" y2="0"/>';
    service.refreshSVGNormalSelection();
    const testHTML: SafeHtml = sanitizer.bypassSecurityTrustHtml(service.rectangle.svg);
    expect(service.rectangle.svgHtml).toEqual(testHTML);
  });

  // Tests refreshSVGInvertedSelection

  it('#refreshSVGInvertedSelection devrait appeler updateParameters', () => {
    service.rectangleInverted = new RectangleService();
    spyOn(service.rectangleInverted, 'updateParameters');
    service.refreshSVGInvertedSelection();
    expect(service.rectangleInverted.updateParameters).toHaveBeenCalledWith(rectangleSelectionTool);
  });

  it('#refreshSVGInvertedSelection devrait avoir la couleur principal à rgba(190, 70, 70, 0.35)', () => {
    service.rectangleInverted = new RectangleService();
    service.refreshSVGInvertedSelection();
    const color = 'rgba(190, 70, 70, 0.35)';
    expect(service.rectangleInverted.primaryColor.RGBAString).toEqual(color);
  });

  it('#refreshSVGInvertedSelection devrait avoir la couleur secondaire à rgba(80, 80, 80, 0.45)', () => {
    service.rectangleInverted = new RectangleService();
    service.refreshSVGInvertedSelection();
    const color = 'rgba(80, 80, 80, 0.45)';
    expect(service.rectangleInverted.secondaryColor.RGBAString).toEqual(color);
  });

  it('#refreshSVGInvertedSelection devrait dessiner le nouveau rectange de selection', () => {
    service.rectangleInverted = new RectangleService();
    spyOn(service.rectangleInverted, 'draw');
    service.refreshSVGInvertedSelection();
    expect(service.rectangleInverted.draw).toHaveBeenCalled();
  });

  it('#refreshSVGInvertedSelection devrait convertir le SVG du rectangle en HTML', () => {
    service.rectangleInverted = new RectangleService();
    service.rectangleInverted.svg = '<line stroke-linecap="square" stroke="rgba(80, 80, 80, 0.45)"'
                                    + 'stroke-width="3" x1="0" y1="0" x2="0" y2="0"/>';
    service.refreshSVGInvertedSelection();
    const testHTML: SafeHtml = sanitizer.bypassSecurityTrustHtml(service.rectangleInverted.svg);
    expect(service.rectangleInverted.svgHtml).toEqual(testHTML);
  });

  // Tests mouseMove

  it('#mouseMove devrait rien faire si ongoingSelection est faux', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.ongoingSelection = false;
    const test = service['widthCalculated'];
    service.mouseMove(mouse);
    expect(service['widthCalculated']).toEqual(test);
  });

  it('#mouseMove devrait modifier widthCalculated si ongoingSelection est vrai', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const test =  Math.abs(service['initialPoint'].x - mouse.offsetX);
    service.mouseMove(mouse);
    expect(service['widthCalculated']).toEqual(test);
  });

  it('#mouseMove devrait modifier basisPoint si ongoingSelection est vrai', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const test =  {x: Math.min(service['initialPoint'].x, mouse.offsetX), y: Math.min(service['initialPoint'].y, mouse.offsetY)};
    service.mouseMove(mouse);
    expect(service['basisPoint']).toEqual(test);
  });

  it('#mouseMove devrait modifier le premier point de rectangleInverted.points si  c\'est un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, buttons: RIGHT_CLICK });
    const testBasisPoint =  {x: Math.min(service['initialPoint'].x, mouse.offsetX), y: Math.min(service['initialPoint'].y, mouse.offsetY)};
    const test = {x: testBasisPoint.x, y: testBasisPoint.y};
    service.mouseMove(mouse);
    expect(service.rectangleInverted.points[0]).toEqual(test);
  });

  it('#mouseMove devrait modifier le second point de rectangleInverted.points si  c\'est un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, buttons: RIGHT_CLICK });
    service['widthCalculated'] = Math.abs(service['initialPoint'].x - mouse.offsetX);
    service['heightCalculated'] = Math.abs(service['initialPoint'].y - mouse.offsetY);

    const testBasisPoint =  {x: Math.min(service['initialPoint'].x, mouse.offsetX), y: Math.min(service['initialPoint'].y, mouse.offsetY)};
    const test = {x: testBasisPoint.x + service['widthCalculated'], y: testBasisPoint.y + service['heightCalculated']};
    service.mouseMove(mouse);
    expect(service.rectangleInverted.points[1]).toEqual(test);
  });

  it('#mouseMove devrait appeler la fonction refreshSVGInvertedSelection si  c\'est un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, buttons: RIGHT_CLICK });
    spyOn(service, 'refreshSVGInvertedSelection');
    service.mouseMove(mouse);
    expect(service.refreshSVGInvertedSelection).toHaveBeenCalled();
  });

  it('#mouseMove devrait modifier le premier point de rectangle.points si  c\'est un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    const testBasisPoint =  {x: Math.min(service['initialPoint'].x, mouse.offsetX), y: Math.min(service['initialPoint'].y, mouse.offsetY)};
    const test = {x: testBasisPoint.x, y: testBasisPoint.y};
    service.mouseMove(mouse);
    expect(service.rectangle.points[0]).toEqual(test);
  });

  it('#mouseMove devrait modifier le second point de rectangle.points si  c\'est un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    service['widthCalculated'] = Math.abs(service['initialPoint'].x - mouse.offsetX);
    service['heightCalculated'] = Math.abs(service['initialPoint'].y - mouse.offsetY);

    const testBasisPoint =  {x: Math.min(service['initialPoint'].x, mouse.offsetX), y: Math.min(service['initialPoint'].y, mouse.offsetY)};
    const test = {x: testBasisPoint.x + service['widthCalculated'], y: testBasisPoint.y + service['heightCalculated']};
    service.mouseMove(mouse);
    expect(service.rectangle.points[1]).toEqual(test);
  });

  it('#mouseMove devrait appeler la fonction refreshSVGNormalSelection si  c\'est un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    spyOn(service, 'refreshSVGNormalSelection');
    service.mouseMove(mouse);
    expect(service.refreshSVGNormalSelection).toHaveBeenCalled();
  });

  it('#mouseMove ne devrait pas appeler de fonction si ce n\'est pas un click gauche ou droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: 6 });
    spyOn(service, 'refreshSVGNormalSelection');
    service.mouseMove(mouse);
    expect(service.refreshSVGNormalSelection).not.toHaveBeenCalled();
  });

  // Tests mouseDown

  it('#mouseDown devrait créer un nouveau rectangleService pour un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    const initRectangle = new RectangleService();
    initRectangle.isDotted = true;
    service.mouseDown(mouse);
    expect(service.rectangle).toEqual(initRectangle);
  });

  it('#mouseDown, le rectangle créé devrait être en pointillé pour un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    service.mouseDown(mouse);
    expect(service.rectangle.isDotted).toBe(true);
  });

  it('#mouseDown devrait donner à un initialPoint les coordonnées de la souris pour un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    const mousePoint: Point = {x: mouse.offsetX, y: mouse.offsetY};
    service.mouseDown(mouse);
    expect(service['initialPoint']).toEqual(mousePoint);
  });

  it('#mouseDown devrait mettre ongoingSelection à true pour un click gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: LEFT_CLICK });
    service.mouseDown(mouse);
    expect(service.ongoingSelection).toBe(true);
  });

  it('#mouseDown devrait créer un nouveau rectangleService pour un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: RIGHT_CLICK });
    const initRectangle = new RectangleService();
    initRectangle.isDotted = true;
    service.mouseDown(mouse);
    expect(service.rectangleInverted).toEqual(initRectangle);
  });

  it('#mouseDown, le rectangle créé devrait être en pointillé pour un click droit ', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: RIGHT_CLICK });
    service.mouseDown(mouse);
    expect(service.rectangleInverted.isDotted).toBe(true);
  });

  it('#mouseDown devrait donner à un initialPoint les coordonnées de la souris pour un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: RIGHT_CLICK });
    const mousePoint: Point = {x: mouse.offsetX, y: mouse.offsetY};
    service.mouseDown(mouse);
    expect(service['initialPoint']).toEqual(mousePoint);
  });

  it('#mouseDown devrait mettre ongoingSelection à true pour un click droit', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: RIGHT_CLICK });
    service.mouseDown(mouse);
    expect(service.ongoingSelection).toBe(true);
  });

  it('#mouseDown devrait rien faire si ce n\'est pas un click droit ou gauche', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100, button: 6 });
    service.rectangle.isDotted = false;
    service.mouseDown(mouse);
    expect(service.rectangle.isDotted).not.toBe(true);
  });

  // Tests mouseUp

  it('#mouseUp devrait mettre basisPoint à {0,0}', () => {
    const nullPoint: Point = {x: 0, y: 0};
    service.mouseUp();
    expect(service['basisPoint']).toEqual(nullPoint);
  });

  it('#mouseUp devrait mettre widthCalculated à 0', () => {
    service.mouseUp();
    expect(service['widthCalculated']).toBe(0);
  });

  it('#mouseUp devrait mettre heightCalculated à 0', () => {
    service.mouseUp();
    expect(service['heightCalculated']).toBe(0);
  });

  it('#mouseUp devrait mettre ongoingSelection à false', () => {
    service.mouseUp();
    expect(service.ongoingSelection).toBe(false);
  });
});
