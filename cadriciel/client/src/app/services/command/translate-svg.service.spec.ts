import { TestBed } from '@angular/core/testing';

import { DomSanitizer } from '@angular/platform-browser';
import { DrawElement } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { SelectionBoxService } from '../tools/selection/selection-box.service';
import { TranslateSvgService } from './translate-svg.service';

// tslint:disable: no-string-literal

const controlPoint1 = new RectangleService();
const controlPoint2 = new RectangleService();
const controlPoint3 = new RectangleService();
const controlPoint4 = new RectangleService();

const selectionBoxStub: Partial<SelectionBoxService> = {
  selectionBox: new RectangleService(),
  controlPointBox: [
    controlPoint1,
    controlPoint2,
    controlPoint3,
    controlPoint4
  ]
};

describe('TranslateSvgService', () => {
  let service: TranslateSvgService;
  let firstElement: DrawElement;
  let secondElement: DrawElement;
  let thirdElement: DrawElement;
  let elements: DrawElement[];
  let selectionBox: SelectionBoxService;
  let sanitizer: DomSanitizer;
  const deleteBoundingBoxStub = jasmine.createSpy();

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: SelectionBoxService, useValue: selectionBoxStub}]
  }));
  beforeEach(() => {
    selectionBox = TestBed.get(SelectionBoxService);
    sanitizer = TestBed.get(DomSanitizer);

    firstElement = new TracePencilService();
    firstElement.points = [{x: 0, y: 0}, {x: 1, y: 2}, {x: 0, y: 3}];
    firstElement.translate = {x: 1, y: 2};
    firstElement.draw();

    secondElement = new RectangleService();
    secondElement.points = [{x: 3, y: 7}, {x: 2, y: 5}];
    secondElement.draw();

    thirdElement = new TracePencilService();
    thirdElement.points = [{x: 0, y: 0}];
    thirdElement.isAPoint = true;
    thirdElement.draw();

    elements = [firstElement, secondElement, thirdElement];
    service = new TranslateSvgService(elements, selectionBox, sanitizer, deleteBoundingBoxStub);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructor

  it('#constructor devrait garder en mémoire la translation du premier élément', () => {
    expect(service['translation']).toEqual({x: 1, y: 2});
  });

  it('#constructor devrait garder une copie de selectedElements dans commandElements', () => {
    expect(service['commandElements']).toEqual([firstElement, secondElement, thirdElement]);
  });

  it('#constructor devrait actualiser le svgHtml de tous les selectedElements', () => {
    expect(service['commandElements'][0].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(firstElement.svg));
    expect(service['commandElements'][1].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(secondElement.svg));
    expect(service['commandElements'][2].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(thirdElement.svg));
  });

  it('#constructor devrait appeler translateAllPoints de tous les selectedElements', () => {
    spyOn(firstElement, 'translateAllPoints');
    spyOn(secondElement, 'translateAllPoints');
    spyOn(thirdElement, 'translateAllPoints');
    service = new TranslateSvgService(elements, selectionBox, sanitizer, deleteBoundingBoxStub);
    expect(firstElement.translateAllPoints).toHaveBeenCalled();
    expect(secondElement.translateAllPoints).toHaveBeenCalled();
    expect(thirdElement.translateAllPoints).toHaveBeenCalled();
  });

  it('#constructor devrait appeler translateAllPoints de selectionBox', () => {
    spyOn(selectionBox.selectionBox, 'translateAllPoints');
    service = new TranslateSvgService(elements, selectionBox, sanitizer, deleteBoundingBoxStub);
    expect(selectionBox.selectionBox.translateAllPoints).toHaveBeenCalled();
  });

  it('#constructor devrait appeler translateAllPoints de tous les controlPointBox de selectionBox', () => {
    spyOn(controlPoint1, 'translateAllPoints');
    spyOn(controlPoint2, 'translateAllPoints');
    spyOn(controlPoint3, 'translateAllPoints');
    spyOn(controlPoint4, 'translateAllPoints');
    service = new TranslateSvgService(elements, selectionBox, sanitizer, deleteBoundingBoxStub);
    expect(controlPoint1.translateAllPoints).toHaveBeenCalled();
    expect(controlPoint2.translateAllPoints).toHaveBeenCalled();
    expect(controlPoint3.translateAllPoints).toHaveBeenCalled();
    expect(controlPoint4.translateAllPoints).toHaveBeenCalled();
  });

  // TESTS undo

  it('#undo devrait appeler applyTranslation avec la translation inverse', () => {
    spyOn(service, 'applyTranslation');
    service.undo();
    expect(service.applyTranslation).toHaveBeenCalledWith({x: -1, y: -2});
  });

  it('#undo devrait appeler la fonction deleteBoundingBox', () => {
    service.undo();
    expect(deleteBoundingBoxStub).toHaveBeenCalled();
  });

  // TESTS redo

  it('#redo devrait appeler applyTranslation avec la translation', () => {
    spyOn(service, 'applyTranslation');
    service.redo();
    expect(service.applyTranslation).toHaveBeenCalledWith({x: 1, y: 2});
  });

  it('#redo devrait appeler la fonction deleteBoundingBox', () => {
    service.redo();
    expect(deleteBoundingBoxStub).toHaveBeenCalled();
  });

  // TESTS applyTranslation

  it('#applyTranslation devrait appeler updatePosition pour tous les éléments avec la translation en x et y', () => {
    spyOn(firstElement, 'updatePosition');
    spyOn(secondElement, 'updatePosition');
    spyOn(thirdElement, 'updatePosition');
    service.applyTranslation({x: 2, y: 0});
    expect(firstElement.updatePosition).toHaveBeenCalledWith(2, 0);
    expect(secondElement.updatePosition).toHaveBeenCalledWith(2, 0);
    expect(thirdElement.updatePosition).toHaveBeenCalledWith(2, 0);
  });

  it('#applyTranslation devrait actualiser le svgHtml de tous les éléments', () => {
    service.applyTranslation({x: 15, y: 32});
    expect(service['commandElements'][0].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(firstElement.svg));
    expect(service['commandElements'][1].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(secondElement.svg));
    expect(service['commandElements'][2].svgHtml).toEqual(sanitizer.bypassSecurityTrustHtml(thirdElement.svg));
  });

  it('#applyTranslation devrait appeler translateAllPoints sur tous les éléments', () => {
    spyOn(firstElement, 'translateAllPoints');
    spyOn(secondElement, 'translateAllPoints');
    spyOn(thirdElement, 'translateAllPoints');
    service.applyTranslation({x: 5, y: 10});
    expect(firstElement.translateAllPoints).toHaveBeenCalled();
    expect(secondElement.translateAllPoints).toHaveBeenCalled();
    expect(thirdElement.translateAllPoints).toHaveBeenCalled();
  });
});
