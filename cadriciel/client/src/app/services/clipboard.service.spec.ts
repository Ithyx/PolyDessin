import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from './canvas-conversion.service';
import { ClipboardService } from './clipboard.service';
import { AddSVGService } from './command/add-svg.service';
import { RemoveSVGService } from './command/remove-svg.service';
import { DrawElement } from './stockage-svg/draw-element/draw-element';
import { TOOL_INDEX } from './tools/tool-manager.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ClipboardService', () => {
  let service: ClipboardService;

  const element: DrawElement = {
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
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
    updateParameters: () => { return; }
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }}}]
  }));

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ClipboardService));
  beforeEach(() => service['selection'].selectionBox['tools'].activeTool =
                    service['selection'].selectionBox['tools'].toolList[TOOL_INDEX.SELECTION]);

  it('should be created', () => {
    const testService: ClipboardService = TestBed.get(ClipboardService);
    expect(testService).toBeTruthy();
  });

  // TESTS copySelectedElement

  it('#copySelectedElement devrait mettre numberofPaste à 0', () => {
    service.copySelectedElement();
    expect(service['numberOfPaste']).toBe(0);
  });

  it('#copySelectedElement devrait copier les elements sélectionnés', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service['savingUtility'], 'createCopyDrawElement');
    service.copySelectedElement();
    expect(spy).toHaveBeenCalledWith(element);
  });

  // TESTS cutSelectedElement

  it('#cutSelectedElement devrait appeler copySelectedElement', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service, 'copySelectedElement');
    service.cutSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#cutSelectedElement devrait appeler deleteSelectedElement', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service, 'deleteSelectedElement');
    service.cutSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS duplicateSelectedElement

  it('#duplicateSelectedElement devrait detruire la boite de selection', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service['selection'], 'deleteBoundingBox');
    service.duplicateSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#duplicateSelectedElement devrait décaler les elements à dupliquer', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(DrawElement.prototype, 'updateTranslation');
    service.duplicateSelectedElement();
    expect(spy).toHaveBeenCalledWith(20, 20);
  });

  it('#duplicateSelectedElement devrait creer une boite de selection', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service['selection'], 'createBoundingBox');
    service.duplicateSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#duplicateSelectedElement devrait effectuer ', () => {
    service['selection'].selectedElements.push(element);
    spyOn(service, 'isInDrawing').and.returnValue(false);
    const spy = spyOn(DrawElement.prototype, 'updateTranslation');
    service.duplicateSelectedElement();
    expect(spy).toHaveBeenCalledWith(-20, -20);
  });

  it('#duplicateSelectedElement devrait executer une nouvelle commande d\'ajout d\'SVG sur le dessin', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service['commands'], 'execute');

    service.duplicateSelectedElement();
    expect(spy).toHaveBeenCalledWith(new AddSVGService(service['duplicatedElements'], service['svgStockage']));
  });

  // TESTS deleteSelectedElement

  it('#deleteSelectedElement devrait ré-initialiser removeCommand', () => {
    service.deleteSelectedElement();
    expect(service['removeCommand']).toEqual(new RemoveSVGService(service['svgStockage']));
  });

  it('#deleteSelecteElement devrait supprimer la boite de selection', () => {
    const spy = spyOn(service['selection'], 'deleteBoundingBox');
    service.deleteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteSelecteElement devrait exectuer la commande removeCommand', () => {
    const spy = spyOn(service['commands'], 'execute');
    service.deleteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS pasteSelectedElement

  it('#pasteSelectedElement devrait detruire la boite de selection', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    const spy = spyOn(service['selection'], 'deleteBoundingBox');
    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#pasteSelectedElement devrait décaler les elements à coller', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    const spy = spyOn(service['copiedElements'][0], 'updateTranslation');
    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalledWith(20, 20);
  });

  it('#pasteSelectedElement devrait copier dans un buffer les éléments à coller si les éléments collés sont sur le dssin', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    spyOn(service, 'isInDrawing').and.returnValue(true);

    const spy = spyOn(service['savingUtility'], 'createCopyDrawElement');

    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#pasteSelectedElement devrait déplacer les éléments à leurs positions d\'origines' +
  'si les éléments à coller ne sont plus dans le dessin', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();
    service['numberOfPaste'] = 2;

    spyOn(service, 'isInDrawing').and.returnValue(false);

    const spy = spyOn(service['copiedElements'][0], 'updateTranslation');

    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalledWith(-40, -40);
  });

  it('#pasteSelectedElement devrait copier dans un buffer les éléments à coller si les éléments collés ne sont plus sur le dssin', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    spyOn(service, 'isInDrawing').and.returnValue(false);

    const spy = spyOn(service['savingUtility'], 'createCopyDrawElement');

    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#pasteSelectedElement devrait executer une nouvelle commande d\'ajout d\'SVG sur le dessin', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    const spy = spyOn(service['commands'], 'execute');

    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalledWith(new AddSVGService(service['copiedElements'], service['svgStockage']));
  });

  it('#pasteSelectedElement devrait creer une boite de selection', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    const spy = spyOn(service['selection'], 'createBoundingBox');

    service.pasteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#pasteSelectedElement devrait incrémenter numberOfPaste', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();

    service.pasteSelectedElement();
    expect(service['numberOfPaste']).toEqual(1);
  });

  // TESTS isInDrawing

  it('#isInDrawing devrait renvoyer faux si le dessin déborde en dehors du dessin', () => {
    service['drawing'].height = 5;
    expect(service.isInDrawing([element])).toBe(false);
  });

  it('#isInDrawing devrait renvoyer vrai si le dessin est dans le dessin', () => {
    service['drawing'].height = 4000;
    service['drawing'].width = 4000;
    expect(service.isInDrawing([element])).toBe(true);
  });

  // TESTS ongoingSelection

  it('#ongoingSelection devrait renvoyer false si aucune element a été copié', () => {
    expect(service.ongoingSelection()).toBe(false);
  });

  it('#ongoingSelection devrait renvoyer true si un element a été copié', () => {
    service['selection'].selectedElements.push(element);
    expect(service.ongoingSelection()).toBe(true);
  });

  // TESTS canPaste

  it('#canPaste devrait renvoyer false si aucune element a été copié', () => {
    expect(service.canPaste()).toBe(false);
  });

  it('#canPaste devrait renvoyer true si un element a été copié', () => {
    service['copiedElements'].push(element);
    expect(service.canPaste()).toBe(true);
  });
});
