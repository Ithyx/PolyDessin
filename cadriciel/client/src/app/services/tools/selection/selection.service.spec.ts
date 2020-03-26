import { TestBed } from '@angular/core/testing';

import { DrawElement } from '../../stockage-svg/draw-element';
import { TOOL_INDEX } from '../tool-manager.service';
import { SelectionService } from './selection.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('SelectionService', () => {
  let service: SelectionService;

  let element: DrawElement;

  let element2: DrawElement;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionService));
  beforeEach(() => service.selectionBox['tools'].activeTool = service.selectionBox['tools'].toolList[TOOL_INDEX.SELECTION]);
  beforeEach(() => element = {
    svg: '',
    svgHtml: '',
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  }
  );
  beforeEach(() => element2 = {
    svg: '',
    svgHtml: '',
    points: [{x: 10, y: 0}, {x: 56, y: 12 }],
    isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  });

  it('should be created', () => {
    const testService: SelectionService = TestBed.get(SelectionService);
    expect(testService).toBeTruthy();
  });

  // TESTS handleClick

  it('#handleClick devrait mettre isSelected des éléments déjà sélectionnés à false', () => {
    service.selectedElements.push(element);
    service.handleClick(element2);
    expect(element.isSelected).toBe(false);
  });

  it('#handleClick devrait mettre isSelected de l\'element cliqué à true', () => {
    service.selectedElements.push(element);
    service.handleClick(element2);
    expect(element2.isSelected).toBe(true);
  });

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

  // TESTS onMouseMove

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

  // TESTS deleteBoundingBox

  it('#deleteBoundingBox devrait supprimer la selectionBox', () => {
    const spy = spyOn(service.selectionBox, 'deleteSelectionBox');
    service.deleteBoundingBox();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteBoundingBox devrait mettre isSelected des éléments de selectedElement à false', () => {
    service.selectedElements.push(element);
    service.deleteBoundingBox();
    expect(element.isSelected).toBe(false);
  });

  it('#deleteBoundingBox devrait vider le tableau selectedElement', () => {
    service.selectedElements.push(element);
    service.deleteBoundingBox();
    expect(service.selectedElements).toEqual([]);
  });

  // TESTS isInRectangleSelection

  // TESTS belongToRectangle

  // TESTS findPointMinAndMax

  it('#findPointMinAndMax devrait mettre à jour pointMin de l\'element donné', () => {
    service.findPointMinAndMax(element);
    expect(element.pointMin).toEqual({x: 76, y: 89 });
  });

  it('#findPointMinAndMax devrait mettre à jour pointMax de l\'element donné', () => {
    service.findPointMinAndMax(element);
    expect(element.pointMax).toEqual({x: 90, y: 90 });
  });

  // TESTS updatePosition

  it('#updatePosition ne devrait rien faire si il n\'y a pas de boite de selection', () => {
    const spy1 = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    const spy2 = spyOn(service.selectionBox, 'updatePosition');
    const spy3 = spyOn(element, 'updatePosition');

    service.selectedElements.push(element);
    service.updatePosition(15, 15);

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#updatePosition devrait mettre à jours l\'HTML des elements sélectionnés', () => {
    element.svg = 'test';
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePosition(15, 15);
    expect(element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml('test'));
  });

  it('#updatePosition devrait appeler la méthode updatePosition des elements sélectionnés', () => {
    const spy = spyOn(element, 'updatePosition');
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePosition(15, 15);
    expect(spy).toHaveBeenCalledWith(15, 15);
  });

  it('#updatePosition devrait appeler la méthode updatePosition de la boite de sélection', () => {
    const spy = spyOn(service.selectionBox, 'updatePosition');
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePosition(15, 15);
    expect(spy).toHaveBeenCalledWith(15, 15);
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse ne devrait rien faire si il n\'y a pas de boite de selection', () => {
    const spy1 = spyOn(service['sanitizer'], 'bypassSecurityTrustHtml');
    const spy2 = spyOn(service.selectionBox, 'updatePositionMouse');
    const spy3 = spyOn(element, 'updatePositionMouse');

    service.selectedElements.push(element);
    service.updatePositionMouse(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));

    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('#updatePositionMouse devrait mettre à jours l\'HTML des elements sélectionnés', () => {
    element.svg = 'test';
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePositionMouse(new MouseEvent('mousedown', {clientX: 15, clientY: 15}));
    expect(element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml('test'));
  });

  it('#updatePositionMouse devrait appeler la méthode updatePositionMouse des elements sélectionnés', () => {
    const spy = spyOn(element, 'updatePositionMouse');
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePositionMouse(mouse);
    expect(spy).toHaveBeenCalledWith(mouse, {x: 20, y: 20});
  });

  it('#updatePositionMouse devrait appeler la méthode updatePositionMouse de la boite de sélection', () => {
    const spy = spyOn(service.selectionBox, 'updatePositionMouse');
    const mouse = new MouseEvent('mousedown', {clientX: 15, clientY: 15});
    service.selectionBox.mouseClick = {x: 20, y: 20};

    service.selectedElements.push(element);
    service.createBoundingBox();
    service.updatePositionMouse(mouse);
    expect(spy).toHaveBeenCalledWith(mouse);
  });

  // TESTS hasMoved

  it('#hasMoved devrait renvoyer true si la sélection a bougé sur l\'axe des x', () => {
    element.translate = {x: 10, y: 0};
    service.selectedElements.push(element);
    expect(service.hasMoved()).toEqual(true);
  });

  it('#hasMoved devrait renvoyer true si la sélection a bougé sur l\'axe des y', () => {
    element.translate = {x: 0, y: 10};
    service.selectedElements.push(element);
    expect(service.hasMoved()).toEqual(true);
  });

  it('#hasMoved devrait renvoyer true si la sélection a bougé sur l\'axe des x et des y', () => {
    element.translate = {x: 10, y: 10};
    service.selectedElements.push(element);
    expect(service.hasMoved()).toEqual(true);
  });

  it('#hasMoved devrait renvoyer false si la sélection n\'a pas bougé', () => {
    element.translate = {x: 0, y: 0};
    service.selectedElements.push(element);
    expect(service.hasMoved()).toEqual(false);
  });

  // TESTS reverseElementSelectionStatus

  it('#reverseElementSelectionStatus devrait ajouter l\'element à selectedElements si il n\'y pas déjà', () => {
    spyOn(service.selectedElements, 'push');
    service.reverseElementSelectionStatus(element);
    expect(service.selectedElements.push).toHaveBeenCalledWith(element);
  });

  it('#reverseElementSelectionStatus devrait mettre isSelected de l\'element à true si l\'element n\'est pas'
  + 'dans selectedElements', () => {
    service.reverseElementSelectionStatus(element);
    expect(element.isSelected).toBe(true);
  });

  it('#reverseElementSelectionStatus devrait mettre isSelected de l\'element à false si l\'element est '
  + 'dans selectedElements', () => {
    service.selectedElements.push(element);
    service.reverseElementSelectionStatus(element);
    expect(element.isSelected).toBe(false);
  });

  it('#reverseElementSelectionStatus devrait mettre isSelected de l\'element à false si l\'element est '
  + 'dans selectedElements', () => {
    service.selectedElements.push(element);
    service.reverseElementSelectionStatus(element);
    expect(element.isSelected).toBe(false);
  });

  it('#reverseElementSelectionStatus devrait retirer l\'element de selectedElement si l\'element est dans selectedElements', () => {
    service.selectedElements.push(element);
    spyOn(service.selectedElements, 'splice');
    service.reverseElementSelectionStatus(element);
    expect(service.selectedElements.splice).toHaveBeenCalledWith(0, 1);
  });

});
