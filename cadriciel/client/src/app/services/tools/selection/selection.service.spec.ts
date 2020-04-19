import { TestBed } from '@angular/core/testing';

import { TransformSvgService } from '../../command/transform-svg.service';
import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { DrawElement } from '../../stockage-svg/draw-element/draw-element';
import { TOOL_INDEX } from '../tool-manager.service';
import { LEFT_CLICK, RIGHT_CLICK, SelectionService } from './selection.service';
import { ControlPosition } from './selection-box.service';
import { CanvasConversionService } from '../../canvas-conversion/canvas-conversion.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('SelectionService', () => {
  let service: SelectionService;

  let element: DrawElement;
  let element2: DrawElement;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }}}]
  }));

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionService));
  beforeEach(() => service.selectionBox['tools'].activeTool = service.selectionBox['tools'].toolList[TOOL_INDEX.SELECTION]);
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
    updateParameters: () => { return; },
  }
  );
  beforeEach(() => element2 = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [{x: 10, y: 0}, {x: 56, y: 12 }],
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
    updateParameters: () => { return; },
  });

  it('should be created', () => {
    const testService: SelectionService = TestBed.get(SelectionService);
    expect(testService).toBeTruthy();
  });

  // TESTS handleClick

  it('#handleClick devrait vider le tableau selectedElements', () => {
    service.selectedElements.push(element);
    const spy = spyOn(service.selectedElements, 'splice');
    service.handleClick(element2);
    expect(spy).toHaveBeenCalledWith(0, 1);
  });

  it('#handleClick devrait ajouter l\'element cliqué au tableau selectedElements', () => {
    service.selectedElements.push(element);
    const spy = spyOn(service.selectedElements, 'push');
    service.handleClick(element2);
    expect(spy).toHaveBeenCalledWith(element2);
  });

  it('#handleClick devrait créer une nouvelle boite de sélection', () => {
    const spy = spyOn(service, 'createBoundingBox');
    service.handleClick(element2);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS handleRightClick

  it('#handleRightClick devrait retirer l\'element de selectedElement si il appartient à selectedElements', () => {
    service.selectedElements.push(element);
    service.handleRightClick(element);
    expect(service.selectedElements.includes(element)).toBe(false);
  });

  it('#handleRightClick appeler deleteBoundingBox si l\'element n\'appartient pas' +
  ' à selectedElements et que selectedElements est vide', () => {
    const spy = spyOn(service, 'deleteBoundingBox');
    service.selectedElements.push(element);
    service.handleRightClick(element);
    expect(spy).toHaveBeenCalled();
  });

  it('#handleRightClick appeler createBoundingBox si l\'element n\'appartient pas' +
  ' à selectedElements et que selectedElements n\'est pas vide', () => {
    const spy = spyOn(service, 'createBoundingBox');
    service.selectedElements.push(element, element2);
    service.handleRightClick(element);
    expect(spy).toHaveBeenCalled();
  });

  it('#handleRightClick devrait ajouter l\'element à slectedElements si il n\'appartient pas à selectedElements', () => {
    service.handleRightClick(element);
    expect(service.selectedElements.includes(element)).toBe(true);
  });

  it('#handleRightClick appeler createBoundingBox si l\'element n\'appartient pas à selectedElements', () => {
    const spy = spyOn(service, 'createBoundingBox');
    service.handleRightClick(element);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS onMouseMove

  it('#onMouseMove ne devrait pas appeler updateTranslationMouse il n\'y a pas de click sur la boite de selection', () => {
    const spy = spyOn(service, 'updateTranslationMouse');
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler updateTranslationMouse si il y a un click dans ou sur la boite de slection', () => {
    service.clickInSelectionBox = true;
    const spy = spyOn(service, 'updateTranslationMouse');
    service.onMouseMove(new MouseEvent('mousemove'));
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler selectionRectangle.mouseMove si il il n\'y a pas de click sur la boite de selection', () => {
    const spy = spyOn(service.selectionRectangle, 'mouseMove');
    const mouse = new MouseEvent('mousemove');
    service.onMouseMove(mouse);
    expect(spy).toHaveBeenCalledWith(mouse);
  });

  it('#onMouseMove ne devrait rien faire  si rectangleInverted a une dimension nulle lors d\'un clic droit', () => {
    const spy1 = spyOn(service.selectionBox, 'deleteSelectionBox');
    const spy2 = spyOn(service, 'isInRectangleSelection');
    const spy3 = spyOn(service, 'createBoundingBox');
    const mouse = new MouseEvent('mousemove', {button: RIGHT_CLICK});
    service.onMouseMove(mouse);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler selectionBox.deleteSelectionBox si rectangleInverted a des dimensions non nuls' +
    ' lors d\'un clic droit', () => {
    const spy1 = spyOn(service.selectionBox, 'deleteSelectionBox');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: RIGHT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler isInRectangleSelection si rectangleInverted a des dimensions non nuls' +
    ' lors d\'un clic droit', () => {
    const spy1 = spyOn(service, 'isInRectangleSelection');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: RIGHT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler createBoundingBox si rectangleInverted a des dimensions non nuls' +
    ' lors d\'un clic droit', () => {
    const spy1 = spyOn(service, 'createBoundingBox');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: RIGHT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler deleteBoundingBox si rectangle a des dimensions non nuls' +
    ' lors d\'un clic gauche', () => {
    const spy1 = spyOn(service, 'deleteBoundingBox');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: LEFT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler isInRectangleSelection si rectangle a des dimensions non nuls' +
    ' lors d\'un clic gauche', () => {
    const spy1 = spyOn(service, 'isInRectangleSelection');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: LEFT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler createBoundingBox si rectangle a des dimensions non nuls' +
    ' lors d\'un clic gauche', () => {
    const spy1 = spyOn(service, 'createBoundingBox');
    const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: LEFT_CLICK});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler createBoundingBox si rectangle a des dimensions non nuls' +
  ' lors d\'un clic gauche', () => {
  const spy1 = spyOn(service, 'createBoundingBox');
  const spy2 = spyOn(service, 'isInRectangleSelection');
  const mouse = new MouseEvent('mousemove', {clientX: 100, clientY: 100, buttons: 0});
  service.onMouseMove(mouse);
  expect(spy1).not.toHaveBeenCalled();
  expect(spy2).not.toHaveBeenCalled();
});

  it('#onMouseMove ne devrait rien faire  si rectangle a une dimension nulle lors d\'un clic gauche', () => {
    const spy1 = spyOn(service, 'deleteBoundingBox');
    const spy2 = spyOn(service, 'isInRectangleSelection');
    const spy3 = spyOn(service, 'createBoundingBox');
    const mouse = new MouseEvent('mousemove', {buttons: LEFT_CLICK});
    service.onMouseMove(mouse);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#onMouseMove ne devrait rien si la nature du click est non reconnue', () => {
    const spy1 = spyOn(service, 'deleteBoundingBox');
    const mouse = new MouseEvent('mouseclick', {clientX: 100, clientY: 100, button: 4, buttons: 4});
    service.selectionRectangle.ongoingSelection = true;
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    service.onMouseMove(mouse);
    expect(spy1).not.toHaveBeenCalled();
  });

  it('#onMouseMove devrait appeler resizeElements si un point de controle est actif', () => {
    const mouse = new MouseEvent('mouseclick', {clientX: 100, clientY: 100});
    const spy = spyOn(service, 'resizeElements');
    service.selectionBox.controlPosition = ControlPosition.LEFT;
    service.selectedElements.push(element, element2);
    service.onMouseMove(mouse);
    expect(spy).toHaveBeenCalledWith(mouse);
  });

  // TESTS onMousePress

  it('#onMousePress devrait appeler mouseDown de selectionRectangle si il n\'y a pas de click sur' +
  'la boite de selection ou à l\'intérieur', () => {
    const mouse = new MouseEvent('click');
    spyOn(service.selectionRectangle, 'mouseDown');
    service.onMousePress(mouse);
    expect(service.selectionRectangle.mouseDown).toHaveBeenCalledWith(mouse);
  });

  it('#onMousePress ne devrait pas appeler mouseDown de selectionRectangle si il y a un click sur la boite de selection', () => {
    service.clickOnSelectionBox = true;
    const mouse = new MouseEvent('click');
    spyOn(service.selectionRectangle, 'mouseDown');
    service.onMousePress(mouse);
    expect(service.selectionRectangle.mouseDown).not.toHaveBeenCalledWith(mouse);
  });

  it('#onMousePress ne devrait pas appeler mouseDown de selectionRectangle si il y a un click à l\'intérieur de ' +
  'la boite de selection', () => {
    service.clickInSelectionBox = true;
    const mouse = new MouseEvent('click');
    spyOn(service.selectionRectangle, 'mouseDown');
    service.onMousePress(mouse);
    expect(service.selectionRectangle.mouseDown).not.toHaveBeenCalledWith(mouse);
  });

  // TESTS onMouseRelease

  it('#onMouseRelease devrait mettre clickOnSelectionBox à false si il y a eu un clic dans ou sur la boite de selection', () => {
    service.clickOnSelectionBox = true;
    service.selectedElements.push(element);
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    service.onMouseRelease();
    expect(service.clickOnSelectionBox).toBe(false);
  });

  it('#onMouseRelease devrait mettre clickInSelectionBox à false si il y a eu un clic dans ou sur la boite de selection', () => {
    service.clickInSelectionBox = true;
    service.selectedElements.push(element);
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    service.onMouseRelease();
    expect(service.clickInSelectionBox).toBe(false);
  });

  it('#onMouseRelease devrait mettre clickInSelectionBox à false si il y a eu un clic dans ou sur la boite de selection', () => {
    service.clickInSelectionBox = true;
    service.selectedElements.push(element);
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    const spy = spyOn(service['command'], 'execute');
    spyOn(service['transformCommand'], 'hasMoved').and.returnValue(true);
    service.onMouseRelease();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseRelease devrait appeler createBoundingBox si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    const spy = spyOn(service, 'createBoundingBox');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseRelease devrait appeler mouseUp de selectionRectangle si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    const spy = spyOn(service.selectionRectangle, 'mouseUp');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseRelease devrait appeler isInRectangleSelection si selectionRectangle.rectangle exitste et ' +
  ' si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    service.selectionRectangle.rectangle = new RectangleService();
    const spy = spyOn(service, 'isInRectangleSelection');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalledWith(service.selectionRectangle.rectangle);
  });

  it('#onMouseRelease devrait appeler isInRectangleSelection si selectionRectangle.rectangleInverted exitste et ' +
  ' si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    service.selectionRectangle.rectangleInverted = new RectangleService();
    const spy = spyOn(service, 'isInRectangleSelection');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalledWith(service.selectionRectangle.rectangleInverted);
  });

  it('#onMouseRelease devrait créer un nouveau rectangleService pour selectionRectangle (rectangle)' +
  ' si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    service.onMouseRelease();
    expect(service.selectionRectangle.rectangle).toEqual(new RectangleService());
  });

  it('#onMouseRelease devrait créer un nouveau rectangleService pour selectionRectangle (rectangleInverted)' +
  ' si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    service.onMouseRelease();
    expect(service.selectionRectangle.rectangleInverted).toEqual(new RectangleService());
  });

  it('#onMouseRelease devrait vider modifiedElement si il n\'y a pas de clic sur ou dans la boite de selection', () => {
    const spy = spyOn(service['modifiedElement'], 'clear');
    service.onMouseRelease();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS createBoundingBox

  it('#createBoundingBox ne devrait pas créer de nouvelle boite si aucun élément est sélectionné', () => {
    const spy = spyOn(service.selectionBox, 'createSelectionBox');
    service.createBoundingBox();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#createBoundingBox devrait créer une nouvelle boite en se basant sur les points des éléments', () => {
    service.selectedElements.push(element, element2);
    const spy = spyOn(service.selectionBox, 'createSelectionBox');
    service.createBoundingBox();
    expect(spy).toHaveBeenCalledWith({x: 10 , y: 0}, {x: 90, y: 90});
  });

  it('#createBoundingBox devrait créer une nouvelle boite en se basant sur les points des éléments' +
  'en comptant l\'epaisseur de l\'element', () => {
    element.thickness = 20;
    element2.thickness = 65;
    service.selectedElements.push(element, element2);
    const spy = spyOn(service.selectionBox, 'createSelectionBox');
    service.createBoundingBox();
    expect(spy).toHaveBeenCalledWith({x: -22.5, y: -32.5}, { x: 100, y: 100});
  });

  // TESTS deleteBoundingBox

  it('#deleteBoundingBox devrait supprimer la selectionBox', () => {
    const spy = spyOn(service.selectionBox, 'deleteSelectionBox');
    service.deleteBoundingBox();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteBoundingBox devrait vider le tableau selectedElement', () => {
    service.selectedElements.push(element);
    service.deleteBoundingBox();
    expect(service.selectedElements).toEqual([]);
  });

  // TESTS isInRectangleSelection

  it('#isInRectangleSelection devrait appeler findPointMinAndMax du parametre rectangleSelection', () => {
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    const spy = spyOn(service, 'isInRectangleSelection');
    service.isInRectangleSelection(service.selectionRectangle.rectangle);
    expect(spy).toHaveBeenCalled();
  });

  it('#isInRectangleSelection devrait ajouter l\'element à selectedElement si il appartient au rectange de selection', () => {
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};

    service['svgStockage'].addSVG(element);

    spyOn(service, 'belongToRectangle').and.returnValue(true);

    service.isInRectangleSelection(service.selectionRectangle.rectangle);
    expect(service.selectedElements.includes(element)).toBe(true);
  });

  it('#isInRectangleSelection devrait ajouter les éléments sélectionnés à modifiedElemet', () => {
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};

    service['svgStockage'].addSVG(element);

    spyOn(service, 'belongToRectangle').and.returnValue(true);

    service.isInRectangleSelection(service.selectionRectangle.rectangleInverted);
    expect(service['modifiedElement'].has(element)).toBe(true);
  });

  it('#isInRectangleSelection devrait inverser le status de selection de l\'élémet si le rectangle de selection est inversé', () => {
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};

    service['svgStockage'].addSVG(element);
    service['modifiedElement'].add(element);

    spyOn(service, 'belongToRectangle').and.returnValue(false);
    const spy = spyOn(service, 'reverseElementSelectionStatus');

    service.isInRectangleSelection(service.selectionRectangle.rectangleInverted);
    expect(spy).toHaveBeenCalled();
  });

  it('#isInRectangleSelection devrait retirer l\'element de modifiedElement si \'element n\'appartient pas' +
  ' au rectangle d\'inversion de sélection', () => {
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};

    service['svgStockage'].addSVG(element);
    service['modifiedElement'].add(element);

    spyOn(service, 'belongToRectangle').and.returnValue(false);

    service.isInRectangleSelection(service.selectionRectangle.rectangleInverted);
    expect(service['modifiedElement'].has(element)).toBe(false);
  });

  it('#isInRectangleSelection ne devrait pas inverser le status de la selection si l\'element n\'appartient pas' +
  ' au rectangle d\'inversion de sélection', () => {
    service.selectionRectangle.rectangleInverted = new RectangleService();
    service.selectionRectangle.rectangleInverted.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangleInverted.points[1] = {x: 100, y: 300};

    service['svgStockage'].addSVG(element);

    spyOn(service, 'belongToRectangle').and.returnValue(false);
    const spy = spyOn(service, 'reverseElementSelectionStatus');

    service.isInRectangleSelection(service.selectionRectangle.rectangleInverted);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#isInRectangleSelection ne devrait rien faire si aucun rectangle de sélection existe', () => {

    service['svgStockage'].addSVG(element);
    service['modifiedElement'].add(element);

    const spy = spyOn(service, 'reverseElementSelectionStatus');
    const spy1 = spyOn(service, 'belongToRectangle');

    service.isInRectangleSelection(new RectangleService());
    expect(spy).not.toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
  });

  it('#isInRectangleSelction ne devrait rien faire si aucun element apparient au rectangle de selection', () => {
    service['svgStockage'].addSVG(element);
    service.selectedElements.push(element);
    service.selectionRectangle.rectangle = new RectangleService();
    service.selectionRectangle.rectangle.points[0] = {x: 80, y: 100};
    service.selectionRectangle.rectangle.points[1] = {x: 100, y: 300};
    spyOn(service, 'belongToRectangle').and.returnValue(true);
    const spy = spyOn(service.selectedElements, 'push');
    service.isInRectangleSelection(new RectangleService());
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS belongToRectangle

  it('#belongToRectangle devrait renvoyer vrai si les pointMin et pointMax de l\'element et du rectangle sont les mêmes', () => {
    element.pointMin = {x: 90, y: 90};
    element.pointMax = {x: 200, y: 200};
    const rectangle = new RectangleService();
    rectangle.pointMin = {x: 90, y: 90};
    rectangle.pointMax = {x: 200, y: 200};

    expect(service.belongToRectangle(element, rectangle)).toBe(true);
  });

  it('#belongToRectangle devrait renvoyer faux si pointMin et pointMax de l\'element sont plus grand que ceux du rectangle', () => {
    element.pointMin = {x: 300, y: 300};
    element.pointMax = {x: 350, y: 350};
    const rectangle = new RectangleService();
    rectangle.pointMin = {x: 90, y: 90};
    rectangle.pointMax = {x: 200, y: 200};

    expect(service.belongToRectangle(element, rectangle)).toBe(false);
  });

  // TESTS findPointMinAndMax

  it('#findPointMinAndMax devrait mettre à jour pointMin de l\'element donné', () => {
    service.findPointMinAndMax(element);
    expect(element.pointMin).toEqual({x: 76, y: 89 });
  });

  it('#findPointMinAndMax devrait mettre à jour pointMax de l\'element donné', () => {
    service.findPointMinAndMax(element);
    expect(element.pointMax).toEqual({x: 90, y: 90 });
  });

  // TESTS updateTranslation

  it('#updateTranslation ne devrait rien faire si il n\'y a pas de boite de selection', () => {
    const spy1 = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    const spy2 = spyOn(service.selectionBox, 'updateTranslation');
    const spy3 = spyOn(element, 'updateTranslation');

    service.selectedElements.push(element);
    service.updateTranslation(15, 15);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#updateTranslation devrait mettre à jours l\'HTML des elements sélectionnés', () => {
    element.svg = 'test';
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslation(15, 15);
    expect(element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml('test'));
  });

  it('#updateTranslation devrait appeler la méthode updateTranslation des elements sélectionnés', () => {
    const spy = spyOn(element, 'updateTranslation');
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslation(15, 15);
    expect(spy).toHaveBeenCalledWith(15, 15);
  });

  it('#updateTranslation devrait appeler la méthode updateTranslation de la boite de sélection', () => {
    const spy = spyOn(service.selectionBox, 'updateTranslation');
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslation(15, 15);
    expect(spy).toHaveBeenCalledWith(15, 15);
  });

  // TESTS updateTranslationMouse

  it('#updateTranslationMouse ne devrait rien faire si il n\'y a pas de boite de selection', () => {
    const spy1 = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    const spy2 = spyOn(service.selectionBox, 'updateTranslationMouse');
    const spy3 = spyOn(element, 'updateTranslationMouse');

    service.selectedElements.push(element);
    service.updateTranslationMouse(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#updateTranslationMouse devrait mettre à jours l\'HTML des elements sélectionnés', () => {
    element.svg = 'test';
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslationMouse(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml('test'));
  });

  it('#updateTranslationMouse devrait appeler la méthode updateTranslationMouse des elements sélectionnés', () => {
    const spy = spyOn(element, 'updateTranslationMouse');
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslationMouse(mouse);
    expect(spy).toHaveBeenCalledWith(mouse);
  });

  it('#updateTranslationMouse devrait appeler la méthode updateTranslationMouse de la boite de sélection', () => {
    const spy = spyOn(service.selectionBox, 'updateTranslationMouse');
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updateTranslationMouse(mouse);
    expect(spy).toHaveBeenCalledWith(mouse);
  });

  // TESTS reverseElementSelectionStatus

  it('#reverseElementSelectionStatus devrait ajouter l\'element à selectedElements si il n\'y pas déjà', () => {
    spyOn(service.selectedElements, 'push');
    service.reverseElementSelectionStatus(element);
    expect(service.selectedElements.push).toHaveBeenCalledWith(element);
  });

  it('#reverseElementSelectionStatus devrait retirer l\'element de selectedElement si l\'element est dans selectedElements', () => {
    service.selectedElements.push(element);
    spyOn(service.selectedElements, 'splice');
    service.reverseElementSelectionStatus(element);
    expect(service.selectedElements.splice).toHaveBeenCalledWith(0, 1);
  });

  // TESTS resizeElements

  it('#resizeElements devrait appeler updateScale des elements sélectionnés', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    const spy = spyOn(element, 'updateScale');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalled();
  });

  it('#resizeElements devrait appeler draw des elements sélectionnés', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    const spy = spyOn(element, 'draw');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalled();
  });

  it('#resizeElements devrait appeler findPointMinAndMax', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    const spy = spyOn(service, 'findPointMinAndMax');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalledWith(element);
  });

  it('#resizeElements devrait modifier le scale en fonction du point de controle appuyé (cas UP)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: -15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.UP;
    const spy = spyOn(element, 'updateScale');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalledWith({x: 1, y: 16}, {x: 0, y: 0});
  });

  it('#resizeElements devrait modifier le scale en fonction du point de controle appuyé (cas DOWN)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.DOWN;
    const spy = spyOn(element, 'updateScale');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalledWith({x: 1, y: 16}, {x: 0, y: 0});
  });

  it('#resizeElements devrait modifier le scale en fonction du point de controle appuyé (cas LEFT)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: -20, clientY: 20});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.LEFT;
    const spy = spyOn(element, 'updateScale');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalledWith({x: 2.428571428571429, y: 1}, {x: 0, y: 0});
  });

  it('#resizeElements devrait modifier le scale en fonction du point de controle appuyé (cas RIGHT)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.RIGHT;
    const spy = spyOn(element, 'updateScale');
    service.resizeElements(mouse);
    expect(spy).toHaveBeenCalledWith({x: 2.071428571428571, y: 1}, {x: 0, y: 0});
  });

  it('#resizeElements devrait modifier la nature du point de controle si le scale est négatif (cas RIGHT)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: -15, clientY: 15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.RIGHT;
    service.resizeElements(mouse);
    expect(service.selectionBox.controlPosition).toEqual(3);
  });

  it('#resizeElements devrait modifier la nature du point de controle si le scale est négatif (cas DOWN)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: -15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.DOWN;
    service.resizeElements(mouse);
    expect(service.selectionBox.controlPosition).toEqual(1);
  });

  it('#resizeElements devrait modifier la nature du point de controle si le scale est négatif (cas UP)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.UP;
    service.resizeElements(mouse);
    expect(service.selectionBox.controlPosition).toEqual(2);
  });

  it('#resizeElements devrait modifier la nature du point de controle si le scale est négatif (cas LEFT)', () => {
    const mouse = new MouseEvent('mousedown', {clientX: 20, clientY: 20});
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.LEFT;
    service.resizeElements(mouse);
    expect(service.selectionBox.controlPosition).toEqual(4);
  });

  // TESTS onMouseLeave

  it('#onMouseLeave ne devrait pas executer transformCommand si aucun point de controle de la sélection est actif', () => {
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.NONE;
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    const spy = spyOn(service['command'], 'execute');
    service.onMouseLeave();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseLeave ne devrait pas executer transformCommand s\'il n\'y eu aucune transformation', () => {
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.LEFT;
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    spyOn(service['transformCommand'], 'hasMoved').and.returnValue(false);
    const spy = spyOn(service['command'], 'execute');
    service.onMouseLeave();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#onMouseLeave devrait executer transformCommand si un point de controle de la sélection est actif et qu\'il y' +
  'a eu une transformation', () => {
    service.handleClick(element);
    service.selectionBox.controlPosition = ControlPosition.LEFT;
    service['transformCommand'] = new TransformSvgService(service.selectedElements, service.sanitizer, service.deleteBoundingBox);
    spyOn(service['transformCommand'], 'hasMoved').and.returnValue(true);
    const spy = spyOn(service['command'], 'execute');
    service.onMouseLeave();
    expect(spy).toHaveBeenCalled();
  });

});
