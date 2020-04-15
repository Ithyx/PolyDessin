/* import { TestBed } from '@angular/core/testing';

import { ClipboardService } from './clipboard.service';
import { DrawElement } from './stockage-svg/draw-element/draw-element';

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

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ClipboardService));

  it('should be created', () => {
    const testService: ClipboardService = TestBed.get(ClipboardService);
    expect(testService).toBeTruthy();
  });

  // TESTS copySelectedElement

  it('#copySelectedElement devrait mettre numberofPaste à 0', () => {
    service.copySelectedElement();
    expect(service['numberOfPaste']).toBe(0);
  });

  it('#copySelectedElement devrait copier les drawElement de selection.selectedElements', () => {
    service['selection'].selectedElements.push(element);
    service.copySelectedElement();
    expect(service['copiedElements'].includes(element)).toBe(true);
  });

  // TESTS cutSelectedElement

  it('#cutSelectedElement devrait appeler copySelectedElement', () => {
    const spy = spyOn(service, 'copySelectedElement');
    service.cutSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#cutSelectedElement devrait appeler cutSelectedElement', () => {
    const spy = spyOn(service, 'cutSelectedElement');
    service.cutSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS duplicateSelectedElement

  // TESTS deleteSelectedElement

  it('#deleteSelectedElement devrait ajouter des elements à supprimer à la commande', () => {
    service['selection'].selectedElements.push(element);
    const spy = spyOn(service['removeCommand'], 'addElements');
    service.deleteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteSelectedElement devrait supprimer la boite de sélection', () => {
    const spy = spyOn(service['selection'], 'deleteBoundingBox');
    service.deleteSelectedElement();
    expect(spy).toHaveBeenCalled();
  });

  it('#deleteSelectedElement devrait exectuer la commande removeCommand', () => {
    const spy = spyOn(service['commands'], 'execute');
    service.deleteSelectedElement();
    expect(spy).toHaveBeenCalledWith(service['removeCommand']);
  });

  // TESTS pasteSelectedElement

  // TESTS isInDrawing

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
}); */
