import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { NUMBER_OF_CONTROL_POINT, SELECTION_BOX_THICKNESS, SelectionBoxService } from './selection-box.service';

// tslint:disable: no-magic-numbers
// tslint:disable:no-string-literal

describe('SelectionBoxService', () => {
  let service: SelectionBoxService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionBoxService));

  beforeEach(() => {
    service['tools'].activeTool = service['tools'].toolList[6];
    service.box = new RectangleService();
    service.controlPointBox = new Array<RectangleService>(NUMBER_OF_CONTROL_POINT);
    for (let index = 0; index < service.controlPointBox.length; index++) {
      service.controlPointBox[index] = new RectangleService();
    }
    service.box.drawShape();
    service.mouseClick = {x: 10, y: 10};
  });

  it('should be created', () => {
    const testService: SelectionBoxService = TestBed.get(SelectionBoxService);
    expect(testService).toBeTruthy();
  });

  // TESTS createSelectionBox

  it('#createSelectionBox devrait initialiser selectionBox', () => {
    service.box.erasingEvidence = true;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.erasingEvidence).toBe(false);
  });

  it('#createSelectionBox devrait initialiser controlPointBox avec NUMBER_OF_CONTROL_POINT élément', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.controlPointBox = [];
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.controlPointBox.length).toEqual(NUMBER_OF_CONTROL_POINT);
  });

  it('#createSelectionBox devrait initialiser controlPointBox pour chaque élément du tableau', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    const test = new Array<RectangleService>(NUMBER_OF_CONTROL_POINT);
    for (let index = 0; index < test.length; index++) {
      test[index] = new RectangleService();
    }
    service.controlPointBox = [];
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.controlPointBox).toEqual(test);
  });

  it('#createSelectionBox devrait initialiser isSelected à vrai', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.isSelected = false;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.isSelected).toBe(true);
  });

  it('#createSelectionBox devrait appeler la fonction updateParameters', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    const test = spyOn(RectangleService.prototype, 'updateParameters');
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(test).toHaveBeenCalledWith(service['tools'].activeTool);
  });

  it('#createSelectionBox devrait assigner le premier point en paramètre au premier élément de points', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.points = [];
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[0]).toEqual({x: 10, y: 10});
  });

  it('#createSelectionBox devrait assigner le deuxième point en paramètre au deuxième élément de points', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.points = [];
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[1]).toEqual({x: 100, y: 100});
  });

  it('#createSelectionBox devrait assigner une chaine de caractères à secondaryColor.RGBAString', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.secondaryColor.RGBAString = 'test';
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.secondaryColor.RGBAString).toEqual('rgba(0, 80, 150, 1)');
  });

  it('#createSelectionBox devrait assigner la constante SELECTION_BOX_THICKNESS à thickness', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.thickness = 42;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.thickness).toEqual(SELECTION_BOX_THICKNESS);
  });

  it('#createSelectionBox devrait appeler la fonction drawShape', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    const test = spyOn(RectangleService.prototype, 'drawShape');
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(test).toHaveBeenCalled();
  });

  it('#createSelectionBox devrait assigner svg à svgHtml', () => {
    spyOn(service, 'createControlPointBox').and.callFake(() => { return; });
    service.box.svgHtml = 'test';
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    expect(service.box.svgHtml).toEqual(test);
  });

  it('#createSelectionBox devrait appeler la fonction createControlPointBox', () => {
    const test = spyOn(service, 'createControlPointBox');
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(test).toHaveBeenCalled();
  });

  // TESTS createControlPointBox
    // TOP
  it('#createControlPointBox devrait intialiser le premier point du premier élément du conteneur controlPointBox', () => {
    const testX = ((service.box.points[0].x + service.box.points[1].x) / 2) - 4;
    const testY = (service.box.points[0].y - 4);
    service.createControlPointBox();
    expect(service.controlPointBox[0].points[0]).toEqual({x: testX, y: testY});
  });

  it('#createControlPointBox devrait intialiser le deuxième point du premier élément du conteneur controlPointBox', () => {
    const testX = ((service.box.points[0].x + service.box.points[1].x) / 2) + 4;
    const testY = (service.box.points[0].y + 4);
    service.createControlPointBox();
    expect(service.controlPointBox[0].points[1]).toEqual({x: testX, y: testY});
  });

  // BOTTOM
  it('#createControlPointBox devrait intialiser le premier point du deuxième élément du conteneur controlPointBox', () => {
    const testX = ((service.box.points[0].x + service.box.points[1].x) / 2) - 4;
    const testY = (service.box.points[1].y - 4);
    service.createControlPointBox();
    expect(service.controlPointBox[1].points[0]).toEqual({x: testX, y: testY});
  });

  it('#createControlPointBox devrait intialiser le deuxième point du deuxième élément du conteneur controlPointBox', () => {
    const testX = ((service.box.points[0].x + service.box.points[1].x) / 2) + 4;
    const testY = (service.box.points[1].y + 4);
    service.createControlPointBox();
    expect(service.controlPointBox[1].points[1]).toEqual({x: testX, y: testY});
  });

  // LEFT
  it('#createControlPointBox devrait intialiser le premier point du troisième élément du conteneur controlPointBox', () => {
    const testX = (service.box.points[0].x - 4);
    const testY = ((service.box.points[0].y + service.box.points[1].y) / 2) - 4;
    service.createControlPointBox();
    expect(service.controlPointBox[2].points[0]).toEqual({x: testX, y: testY});
  });

  it('#createControlPointBox devrait intialiser le deuxième point du troisième élément du conteneur controlPointBox', () => {
    const testX = (service.box.points[0].x + 4);
    const testY = ((service.box.points[0].y + service.box.points[1].y) / 2) + 4;
    service.createControlPointBox();
    expect(service.controlPointBox[2].points[1]).toEqual({x: testX, y: testY});
  });

  // RIGHT
  it('#createControlPointBox devrait intialiser le premier point du quatrième élément du conteneur controlPointBox', () => {
    const testX = (service.box.points[1].x - 4);
    const testY = ((service.box.points[0].y + service.box.points[1].y) / 2) - 4;
    service.createControlPointBox();
    expect(service.controlPointBox[3].points[0]).toEqual({x: testX, y: testY});
  });

  it('#createControlPointBox devrait intialiser le deuxième point du quatrième élément du conteneur controlPointBox', () => {
    const testX = (service.box.points[1].x + 4);
    const testY = ((service.box.points[0].y + service.box.points[1].y) / 2) + 4;
    service.createControlPointBox();
    expect(service.controlPointBox[3].points[1]).toEqual({x: testX, y: testY});
  });

  it('#createControlPointBox devrait intialiser chaque point de controlPointBox avec les mêmes attributs', () => {
    const testUpdateParameters = spyOn(RectangleService.prototype, 'updateParameters');
    const testdrawShape = spyOn(RectangleService.prototype, 'drawShape');
    service.createControlPointBox();
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.isSelected).toBe(true);
      expect(testUpdateParameters).toHaveBeenCalledWith(service['tools'].activeTool);
      expect(controlPoint.chosenOption).toEqual('Plein avec contour');
      expect(controlPoint.primaryColor.RGBAString).toEqual('rgba(0, 0, 0, 1)');
      expect(controlPoint.secondaryColor.RGBAString).toEqual('rgba(0, 255, 0, 1)');
      expect(controlPoint.thickness).toEqual(4);
      expect(testdrawShape).toHaveBeenCalled();

      expect(controlPoint.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml(controlPoint.svg));
    }
  });

  // TESTS deleteSelectionBox

  it('#deleteSelectionBox devrait effacer selectionBox', () => {
    service.deleteSelectionBox();
    expect(service.box).toBeUndefined();
  });

  it('#deleteSelectionBox devrait effacer controlPointBox s\'il y en a', () => {
    service.deleteSelectionBox();
    expect(service.controlPointBox).toBeUndefined();
  });

  it('#deleteSelectionBox devrait rien faire avec controlPointBox s\'il n\'y en a pas', () => {
    delete service.controlPointBox;
    service.deleteSelectionBox();
    expect(service.controlPointBox).toBeUndefined();
  });

  // TESTS updateTranslation

  it('#updateTranslation devrait ajouter les nombres en paramètre à translate pour selectionBox', () => {
    service.box.translate = {x: 10, y: 10};
    service.updateTranslation(100, 100);
    expect(service.box.translate).toEqual({x: 110, y: 110});
  });

  it('#updateTranslation devrait appeler la fonction drawShape pour selectionBox', () => {
    const test = spyOn(service.box, 'drawShape');
    service.updateTranslation(100, 100);
    expect(test).toHaveBeenCalled();
  });

  it('#updateTranslation devrait assigner svg à svgHtml pour selectionBox', () => {
    service.box.svgHtml = 'test';
    service.updateTranslation(100, 100);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    expect(service.box.svgHtml).toEqual(test);
  });

  it('#updateTranslation devrait ajouter les nombres en paramètre à translate pour chaque point de controlPointBox', () => {
    for (const controlPoint of service.controlPointBox) {
      controlPoint.translate = {x: 10, y: 10};
    }
    service.updateTranslation(100, 100);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.translate).toEqual({x: 110, y: 110});
    }
  });

  it('#updateTranslation devrait appeler la fonction drawShape pour chaque point de controlPointBox', () => {
    for (const controlPoint of service.controlPointBox) {
      spyOn(controlPoint, 'drawShape');
    }
    service.updateTranslation(100, 100);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.drawShape).toHaveBeenCalled();
    }
  });

  it('#updateTranslation devrait assigner svg à svgHtml pour chaque point de controlPointBox', () => {
    for (const controlPoint of service.controlPointBox) {
      controlPoint.svgHtml = 'test';
    }
    service.updateTranslation(100, 100);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.svgHtml).toEqual(test);
    }
  });

  // TESTS updateTranslationMouse

  it('#updateTranslationMouse devrait ajouter les nombres en paramètre à translate pour selectionBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.updateTranslationMouse(click);
    expect(service.box.translate).toEqual({x: 90, y: 90});
  });

  it('#updateTranslationMouse devrait appeler la fonction drawShape pour selectionBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const test = spyOn(service.box, 'drawShape');
    service.updateTranslationMouse(click);
    expect(test).toHaveBeenCalled();
  });

  it('#updateTranslationMouse devrait assigner svg à svgHtml pour selectionBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.box.svgHtml = 'test';
    service.updateTranslationMouse(click);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    expect(service.box.svgHtml).toEqual(test);
  });

  it('#updateTranslationMouse devrait ajouter les nombres en paramètre à translate pour chaque point de controlPointBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    for (const controlPoint of service.controlPointBox) {
      controlPoint.translate = {x: 10, y: 10};
    }
    service.updateTranslationMouse(click);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.translate).toEqual({x: 90, y: 90});
    }
  });

  it('#updateTranslationMouse devrait appeler la fonction drawShape pour chaque point de controlPointBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    for (const controlPoint of service.controlPointBox) {
      spyOn(controlPoint, 'drawShape');
    }
    service.updateTranslationMouse(click);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.drawShape).toHaveBeenCalled();
    }
  });

  it('#updateTranslationMouse devrait assigner svg à svgHtml pour chaque point de controlPointBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    for (const controlPoint of service.controlPointBox) {
      controlPoint.svgHtml = 'test';
    }
    service.updateTranslationMouse(click);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    for (const controlPoint of service.controlPointBox) {
      expect(controlPoint.svgHtml).toEqual(test);
    }
  });
});
