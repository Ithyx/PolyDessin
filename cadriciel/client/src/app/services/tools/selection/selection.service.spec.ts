import { TestBed } from '@angular/core/testing';

import { DrawElement } from '../../stockage-svg/draw-element';
import { TOOL_INDEX } from '../tool-manager.service';
import { SelectionService } from './selection.service';

// tslint:disable: no-string-literal

describe('SelectionService', () => {
  let service: SelectionService;

  const element: DrawElement = {
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
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionService));
  beforeEach(() => service.selectionBox['tools'].activeTool = service.selectionBox['tools'].toolList[TOOL_INDEX.SELECTION]);

  it('should be created', () => {
    const testService: SelectionService = TestBed.get(SelectionService);
    expect(testService).toBeTruthy();
  });

  // TESTS handleClick

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

  // TESTS deleteBoundingBox

  // TESTS isInRectangleSelection

  // TESTS belongToRectangle

  // TESTS findPointMinAndMax

  // TESTS updatePosition

  // TESTS updatePositionMouse

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
