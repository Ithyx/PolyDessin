import { TestBed } from '@angular/core/testing';

import { PrimaryColorChangeService } from '../command/primary-color-change.service';
import { SecondaryColorChangeService } from '../command/secondary-color-change.service';
import { Color, DrawElement } from '../stockage-svg/draw-element';
import { ColorChangerToolService } from './color-changer-tool.service';

// tslint:disable: no-string-literal

describe('ColorChangerToolService', () => {
  let service: ColorChangerToolService;

  const testingBlackColor: Color = {
    RGBAString: 'rgba(0, 0, 0, 1)',
    RGBA: [0, 0, 0, 1]
  };
  const testingWhiteColor: Color = {
    RGBAString: 'rgba(255, 255, 255, 1)',
    RGBA: [0, 0, 0, 1]
  };
  const element: DrawElement = {
    svg: '',
    svgHtml: '',
    points: [],
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
  beforeEach(() => service = TestBed.get(ColorChangerToolService));

  it('should be created', () => {
    const testService: ColorChangerToolService = TestBed.get(ColorChangerToolService);
    expect(testService).toBeTruthy();
  });

  // TESTS onMouseClick

  it('#onMouseClick ne devrait rien faire s\'il n\'y pas d\'element actif', () => {
    spyOn(service['commands'], 'execute');
    service.onMouseClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onMouseClick ne devrait rien faire si la couleur principal de l\'element actif est la même que celle choisi', () => {
    service.activeElement = element;
    service.activeElement.primaryColor = testingBlackColor;
    service['colorParameter'].primaryColor = testingBlackColor;

    spyOn(service['commands'], 'execute');
    service.onMouseClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it(`#onMouseClick devrait executer la commande de changement de couleur si la couleur principal de l\'element actif est
      différente de celle choisi`, () => {
    service.activeElement = {...element};
    service.activeElement.primaryColor = testingBlackColor;
    service['colorParameter'].primaryColor = testingWhiteColor;

    spyOn(service['commands'], 'execute');
    service.onMouseClick();
    expect(service['commands'].execute)
        .toHaveBeenCalledWith(new PrimaryColorChangeService(element, service['colorParameter'], service['sanitizer']));
  });

  // TESTS onRightClick

  it('#onRightClick ne devrait rien faire s\'il n\'y pas d\'element actif', () => {
    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onRightClick ne devrait rien faire si la couleur secondaire de l\'element actif est la même que celle choisi', () => {
    service.activeElement = element;
    service.activeElement.secondaryColor = testingBlackColor;
    service['colorParameter'].secondaryColor = testingBlackColor;

    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it(`#onRightClick devrait executer la commande de changement de couleur si la couleur secondaire de l\'element actif est
      différente de celle choisi`, () => {
    service.activeElement = element;
    service.activeElement.primaryColor = testingBlackColor;
    service['colorParameter'].primaryColor = testingWhiteColor;

    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute)
        .toHaveBeenCalledWith(new SecondaryColorChangeService(element, service['colorParameter'], service['sanitizer']));
  });

});
