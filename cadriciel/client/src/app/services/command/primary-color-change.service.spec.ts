import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { Color } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { PrimaryColorChangeService } from './primary-color-change.service';

describe('PrimaryColorChangeService', () => {
  let stockageService: SVGStockageService;
  let colorParameter: ColorParameterService;
  let service: PrimaryColorChangeService;
  const color: Color = {
    RGBAString: 'test',
    RGBA: [0, 0, 0, 1]
  };
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    stockageService.addSVG(new RectangleService());
    colorParameter = TestBed.get(ColorParameterService);
    service = new PrimaryColorChangeService(new RectangleService(), colorParameter, TestBed.get(DomSanitizer));
    service.oldColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS undo

  it('#undo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.undo();
    expect(service.changeColor).toHaveBeenCalledWith(service.oldColor);
  });

  // TESTS redo

  it('#redo devrait appeler la fonction changeColor', () => {
    spyOn(service, 'changeColor');
    service.redo();
    expect(service.changeColor).toHaveBeenCalledWith(service.oldColor);
  });

  // TESTS changeColor

  it('#changeColor ne devrait pas modifier oldColor si primaryColor est une chaine vide', () => {
    service.element.primaryColor = undefined;
    service.oldColor = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service.oldColor.RGBAString).toEqual('test');
  });

  it('#changeColor devrait modifier oldColor si primaryColor n\'est pas une chaine vide', () => {
    service.element.primaryColor = {
      RGBAString: 'Plein',
      RGBA: [0, 0, 0, 1]
    };
    service.oldColor = {
      RGBAString: 'test',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service.oldColor.RGBAString).toEqual('Plein');
  });

  it('#changeColor devrait modifier primaryColor pour lui attribuer celui en paramètre', () => {
    service.element.primaryColor = {
      RGBAString: 'Plein',
      RGBA: [0, 0, 0, 1]
    };
    service.changeColor(color);
    expect(service.element.primaryColor.RGBAString).toEqual('test');
  });

  it('#changeColor devrait appeler la fonction draw', () => {
    spyOn(service.element, 'draw');
    service.changeColor(color);
    expect(service.element.draw).toHaveBeenCalled();
  });

  it('#changeColor devrait appeler la fonction bypassSecurityTrustHtml pour attribuer svg dans svgHtml', () => {
    service.element.svg = 'test';
    service.changeColor(color);
    // tslint:disable-next-line:no-string-literal
    expect(service.element.svgHtml).toEqual(service['sanitizer'].bypassSecurityTrustHtml(service.element.svg));
  });
});
