import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TOOL_INDEX, ToolManagerService } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';
import { LineService } from './line.service';
import { SVGStockageService } from './svg-stockage.service';

// tslint:disable: no-string-literal

describe('SVGStockageService', () => {
  let SVGHTML: SafeHtml;
  let lineElement: LineService;
  let drawElement: DrawElement;
  let service: SVGStockageService;
  let sanitizer: DomSanitizer;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SVGStockageService));
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));
  beforeEach(() => SVGHTML = sanitizer.bypassSecurityTrustHtml(
  '<path fill="transparent" stroke="black" stroke-width="1" d="M467 330 L460 300"/>'));
  beforeEach(() => {
    TestBed.get(ToolManagerService).activeTool = {name: '', ID: -1, isActive: true, parameters: [
      {name: '', type: '', value: 0},
      {name: '', type: '', chosenOption: ''},
      {name: '', type: '', value: 0}
    ], iconName: ''};
  });
  beforeEach(() => {
    drawElement = new LineService();
    lineElement = new LineService();
    lineElement.svgHtml = '';
    lineElement.points = [{x: 10, y: 10}];
    lineElement.isSelected = true;
    lineElement.primaryColor = {
      RGBAString: 'rgba(0,1,0,1)',
      RGBA: [0, 1, 0, 1]
    };
    lineElement.updateParameters({name: 'test', isActive: true, ID: -1, parameters: [
      {name: '', type: '', value: 0},
      {name: '', type: '', chosenOption: ''},
      {name: '', type: '', value: 0}
    ], iconName: 'nomIcone'});
    lineElement.isAPolygon = false;
    lineElement.mousePosition = {x: 100, y: 100};
    lineElement.translate = { x: 20, y: 20};
  } );

  it('should be created', () => {
    const testService: SVGStockageService = TestBed.get(SVGStockageService);
    expect(testService).toBeTruthy();
  });

  // TESTS addSVG

  it('#addSVG devrait attribuer la valeur de SVG à SVGHtml', () => {
    SVGHTML = sanitizer.bypassSecurityTrustHtml(drawElement.svg);
    service.addSVG(drawElement);
    expect(drawElement.svgHtml).toEqual(SVGHTML);
  });

  it('#addSVG devrait ajouter drawElement en paramètre à completeSVG', () => {
    service.addSVG(drawElement);
    expect(service['completeSVG'][service.size - 1]).toEqual(drawElement);
  });

  it('#addSVG devrait mettre ongoingSVG vide si l\'outil actif n\'est pas l\'efface', () => {
    service['ongoingSVG'] = 'test';
    service.addSVG(drawElement);
    expect(service['ongoingSVG']).toEqual('');
  });

  it('#addSVG devrait mettre garder ongoingSVG  si l\'outil actif est l\'efface', () => {
    service['tools'].activeTool.ID = TOOL_INDEX.ERASER;
    service['ongoingSVG'] = 'test';
    service.addSVG(drawElement);
    expect(service['ongoingSVG']).toEqual('test');
  });

  it('#addSVG devrait mettre ongoingPerimeter vide', () => {
    service['ongoingPerimeter'] = 'test';
    service.addSVG(drawElement);
    expect(service['ongoingPerimeter']).toEqual('');
  });

  // TESTS removeSVG

  it('#removeSVG devrait appeler la fonction splice avec id et 1 en paramètre', () => {
    const idTest = service.size;
    service.addSVG(lineElement);
    spyOn(service['completeSVG'], 'splice');
    service.removeSVG(lineElement);
    expect(service['completeSVG'].splice).toHaveBeenCalledWith(idTest, 1);
  });

  it('#removeLastSVG devrait décrémenter size', () => {
    const content = service.size;
    service.addSVG(lineElement);
    service.removeSVG(lineElement);
    expect(service.size).toEqual(content);
  });

  // TESTS removeLastSVG

  it('#removeLastSVG devrait retirer le dernier élément de completeSVG', () => {
    service.addSVG(lineElement);
    const object = service['completeSVG'][service.size - 1];
    service.removeLastSVG();
    expect(service['completeSVG'][service.size - 1]).not.toEqual(object);
  });

  it('#removeLastSVG devrait décrémenter size', () => {
    const content = service.size;
    service.addSVG(lineElement);
    service.removeLastSVG();
    expect(service.size).toEqual(content);
  });

  // TESTS getOngoingSVGHTML

  it('#getOngoingSVGHTML devrait retourner ongoingSVG', () => {
    expect(service.getOngoingSVGHTML()).toEqual(service['ongoingSVG']);
  });

  // TESTS getOngoingPerimeterHTML

  it('#getOngoingPerimeterHTML devrait retourner ongoingPerimeter', () => {
    expect(service.getOngoingPerimeterHTML()).toEqual(service['ongoingPerimeter']);
  });

  // TESTS setOngoingSVG

  it('#setOngoingSVG devrait assigner SVG à setOngoingSVG', () => {
    drawElement.svg = 'test';
    service.setOngoingSVG(drawElement);
    expect(service['ongoingSVG']).toEqual(service['sanitizer'].bypassSecurityTrustHtml(drawElement.svg));
  });

  it('#setOngoingSVG devrait modifier ongoingPerimeter si perimeter est défini', () => {
    drawElement.perimeter = 'test';
    service.setOngoingSVG(drawElement);
    expect(service['ongoingPerimeter']).toEqual(service['sanitizer'].bypassSecurityTrustHtml(drawElement.perimeter));
  });

  // TEST getCompleteSVG

  it('#getCompleteSVG devrait retourner le tableau completeSVG', () => {
    service.addSVG(drawElement);
    service.addSVG(drawElement);
    const SVG_TEST = service.getCompleteSVG();
    expect(service['completeSVG']).toEqual(SVG_TEST);
  });

  // TESTS cleanDrawing

  it('#cleanDrawing devrait vider completeSVG', () => {
    service.addSVG(drawElement);
    service.addSVG(drawElement);
    service.cleanDrawing();
    expect(service['completeSVG']).toEqual([]);
  });

  it('#cleanDrawing devrait mettre size à 0', () => {
    service.size = 2;
    service.cleanDrawing();
    expect(service.size).toEqual(0);
  });
});
