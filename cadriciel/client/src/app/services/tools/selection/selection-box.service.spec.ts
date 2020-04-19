import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../../stockage-svg/draw-element/basic-shape/rectangle.service';
import { ControlPosition, NUMBER_OF_CONTROL_POINT, SELECTION_BOX_THICKNESS, SelectionBoxService } from './selection-box.service';

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

  it('#createSelectionBox devrait modifier box.points[0] (cas du point de control DOWN)', () => {
    service.controlPosition = ControlPosition.DOWN;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[0]).toEqual({x: 10, y: service.scaleCenter.y});
  });

  it('#createSelectionBox devrait modifier box.points[0] (cas du point de control RIGHT)', () => {
    service.controlPosition = ControlPosition.RIGHT;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[0]).toEqual({x: service.scaleCenter.x, y: 10});
  });

  it('#createSelectionBox devrait modifier box.points[1] (cas du point de control UP)', () => {
    service.controlPosition = ControlPosition.UP;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[1]).toEqual({x: 100, y: service.scaleCenter.y});
  });

  it('#createSelectionBox devrait modifier box.points[1] (cas du point de control LEFT)', () => {
    service.controlPosition = ControlPosition.LEFT;
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    expect(service.box.points[1]).toEqual({x: service.scaleCenter.x, y: 100});
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

  it('#updateTranslation devrait assigner svg à svgHtml pour selectionBox', () => {
    service.box.svgHtml = 'test';
    service.updateTranslation(100, 100);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    expect(service.box.svgHtml).toEqual(test);
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

  it('#updateTranslationMouse devrait assigner svg à svgHtml pour selectionBox', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.box.svgHtml = 'test';
    service.updateTranslationMouse(click);
    const test = service['sanitizer'].bypassSecurityTrustHtml(service.box.svg);
    expect(service.box.svgHtml).toEqual(test);
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

  // TESTS controlPointMouseDown

  it('#controlPointMouseDown devrait assigner les coordonnées du clic à mouseClick', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    service.controlPointMouseDown(click, 0);
    expect(service.mouseClick).toEqual({x: 100, y: 100});
  });

  it('#controlPointMouseDown devrait modifier les coordonnées de scaleCenter (cas du point de control UP)', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    service.controlPointMouseDown(click, 0);
    expect(service.scaleCenter).toEqual({x: 100, y: service.box.strokePoints[2].y});
  });

  it('#controlPointMouseDown devrait modifier les coordonnées de scaleCenter (cas du point de control DOWN)', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    service.controlPointMouseDown(click, 1);
    expect(service.scaleCenter).toEqual({x: 100, y: service.box.strokePoints[0].y});
  });

  it('#controlPointMouseDown devrait modifier les coordonnées de scaleCenter (cas du point de control LEFT)', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    service.controlPointMouseDown(click, 2);
    expect(service.scaleCenter).toEqual({x: service.box.strokePoints[1].x, y: 100});
  });

  it('#controlPointMouseDown devrait modifier les coordonnées de scaleCenter (cas du point de control RIGHT)', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.createSelectionBox({x: 10, y: 10}, {x: 100, y: 100});
    service.controlPointMouseDown(click, 3);
    expect(service.scaleCenter).toEqual({x: service.box.strokePoints[0].x, y: 100});
  });
});
