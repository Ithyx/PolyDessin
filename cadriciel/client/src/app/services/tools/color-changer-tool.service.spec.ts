import { TestBed } from '@angular/core/testing';

// import { ColorParameterService } from '../color/color-parameter.service';
import { PrimaryColorChangeService } from '../command/primary-color-change.service';
import { SecondaryColorChangeService } from '../command/secondary-color-change.service';
import { Color } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { ColorChangerToolService } from './color-changer-tool.service';
import { DomSanitizer } from '@angular/platform-browser';

// tslint:disable: no-string-literal

describe('ColorChangerToolService', () => {
  let service: ColorChangerToolService;
  let sanitizer: DomSanitizer;
  const testingBlackColor: Color = {
    RGBAString: 'rgba(0, 0, 0, 1)',
    RGBA: [0, 0, 0, 1]
  };
  const testingWhiteColor: Color = {
    RGBAString: 'rgba(255, 255, 255, 1)',
    RGBA: [0, 0, 0, 1]
  };

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ColorChangerToolService));
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));

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
    service.activeElement = new TracePencilService();
    service.activeElement.primaryColor = testingBlackColor;
    service['colorParameter'].primaryColor = testingBlackColor;

    spyOn(service['commands'], 'execute');
    service.onMouseClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it(`#onMouseClick devrait executer la commande de changement de couleur si la couleur principal de l\'element actif est
      différente de celle choisi`, () => {
    service.activeElement = new TracePencilService();
    service.activeElement.primaryColor = testingBlackColor;
    service['colorParameter'].primaryColor = testingWhiteColor;

    spyOn(service['commands'], 'execute');
    service.onMouseClick();
    expect(service['commands'].execute)
        .toHaveBeenCalledWith(new PrimaryColorChangeService(service.activeElement, service['colorParameter'], sanitizer));
  });

  // TESTS onRightClick

  it('#onRightClick ne devrait rien faire s\'il n\'y pas d\'element actif', () => {
    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#onRightClick ne devrait rien faire si la couleur secondaire de l\'element actif est la même que celle choisi', () => {
    service.activeElement = new RectangleService();
    service.activeElement.secondaryColor = testingBlackColor;
    service['colorParameter'].secondaryColor = testingBlackColor;

    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it(`#onRightClick devrait executer la commande de changement de couleur si la couleur principal de l\'element actif est
      différente de celle choisi`, () => {
    service.activeElement = new RectangleService();
    service.activeElement.secondaryColor = testingBlackColor;
    service['colorParameter'].secondaryColor = testingWhiteColor;

    spyOn(service['commands'], 'execute');
    service.onRightClick();
    expect(service['commands'].execute)
       .toHaveBeenCalledWith(new SecondaryColorChangeService(service.activeElement, service['colorParameter'], sanitizer));
  });

});
