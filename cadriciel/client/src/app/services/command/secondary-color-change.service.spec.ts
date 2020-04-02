import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Color } from '../color/color';
import { ColorParameterService } from '../color/color-parameter.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TracePencilService } from '../stockage-svg/trace/trace-pencil.service';
import { SecondaryColorChangeService } from './secondary-color-change.service';

// tslint:disable: no-string-literal

describe('SecondaryColorChangeService', () => {
  let stockageService: SVGStockageService;
  let colorParameter: ColorParameterService;
  let service: SecondaryColorChangeService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    stockageService.addSVG(new TracePencilService());
    colorParameter = TestBed.get(ColorParameterService);
    service = new SecondaryColorChangeService(new TracePencilService(), colorParameter, TestBed.get(DomSanitizer));
    service['oldColor'] = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS constructeur

  it('Le constructeur devrait appeler la fonction changeColor', () => {
    const test = spyOn(SecondaryColorChangeService.prototype, 'changeColor');
    service = new SecondaryColorChangeService(new TracePencilService(), colorParameter, TestBed.get(DomSanitizer));
    expect(test).toHaveBeenCalledWith(colorParameter.secondaryColor);
  });

  // TESTS undo

  it('#undo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.undo();
    expect(service.changeColor).toHaveBeenCalledWith(service['oldColor']);
  });

  // TESTS redo

  it('#redo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.redo();
    expect(service.changeColor).toHaveBeenCalledWith(service['oldColor']);
  });

  // TESTS changeColor

  it('#changeColor ne devrait pas modifier oldColor si secondaryColor est une chaine vide', () => {
    service['element'].secondaryColor = undefined;
    service['oldColor'] = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    const color: Color = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service['oldColor']).toEqual(color);
  });

  it('#changeColor devrait modifier oldColor si secondaryColor n\'est pas une chaine vide', () => {
    service['element'].secondaryColor = {
      RGBAString: 'Plein',
      RGBA: [0, 0, 0, 1]
    };
    service['oldColor'] = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    const color: Color = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service['oldColor'].RGBAString).toEqual('Plein');
  });

  it('#changeColor devrait modifier secondaryColor pour lui attribuer celui en paramètre', () => {
    service['element'].secondaryColor = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    const color: Color = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service['element'].secondaryColor).toEqual(color);
  });

  it('#changeColor devrait appeler la fonction draw', () => {
    spyOn(service['element'], 'draw');
    const color: Color = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service['element'].draw).toHaveBeenCalled();
  });

  it('#changeColor devrait appeler la fonction bypassSecurityTrustHtml pour attribuer svg dans svgHtml', () => {
    service['element'].svg = 'test';
    const color: Color = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    // tslint:disable-next-line:no-string-literal
    expect(service['element'].svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml(service['element'].svg));
  });
});
