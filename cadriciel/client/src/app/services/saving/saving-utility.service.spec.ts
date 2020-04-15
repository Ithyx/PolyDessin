/* import { TestBed } from '@angular/core/testing';

import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { SavingUtilityService } from './saving-utility.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SavingUtilityService', () => {
  let service: SavingUtilityService;
  const elementBackup: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [],
    // isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  };
  let element: DrawElement;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => element = elementBackup);
  beforeEach(() => service = TestBed.get(SavingUtilityService));

  it('should be created', () => {
    const testService: SavingUtilityService = TestBed.get(SavingUtilityService);
    expect(testService).toBeTruthy();
  });

  // TESTS addElement
  it('#addElement devrait appeler setupElement peut importe le type de l\'objet chargé', () => {
    const spy = spyOn(service, 'setupElement');
    for (let i = 0; i < 12; ++i) {
      element.trueType = i;
      service.addElement(element);
    }
    expect(spy).toHaveBeenCalledTimes(12);
  });

  // TESTS setupElement
  it('#setupElement devrait appeler addSVG avec une copie exacte de l\'ancien élément', () => {
    element.primaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.secondaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.thickness = 0;
    element.thicknessLine = 0;
    element.thicknessPoint = 0;
    element.texture = '';
    element.perimeter = '';
    element.isAPoint = false;
    element.isDotted = false;
    element.chosenOption = '';
    element.isAPolygon = false;
    const spy = spyOn(service['stockageSVG'], 'addSVG');
    service.setupElement({...element}, element);
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#setupElement devrait appeller addSVG avec une copie exacte de l\'ancien élément', () => {
    element.primaryColor = undefined;
    element.secondaryColor = undefined;
    element.thickness = undefined;
    element.thicknessLine = undefined;
    element.thicknessPoint = undefined;
    element.texture = undefined;
    element.perimeter = undefined;
    element.isAPoint = undefined;
    element.isDotted = undefined;
    element.chosenOption = undefined;
    element.isAPolygon = undefined;
    const spy = spyOn(service['stockageSVG'], 'addSVG');
    service.setupElement({...element}, element);
    expect(spy).toHaveBeenCalledWith(element);
  });
}); */
