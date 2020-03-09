import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawElement } from './draw-element';
import { LineService } from './line.service';
import { SVGStockageService } from './svg-stockage.service';

describe('StockageSvgService', () => {
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
    drawElement = new LineService();
    lineElement = new LineService();
    lineElement.SVGHtml = '';
    lineElement.points = [{x: 10, y: 10}];
    lineElement.isSelected = true;
    lineElement.primaryColor = 'rgba(0,1,0,1)';
    lineElement.tool = {name: 'test', isActive: true, ID: -1, parameters: [], iconName: 'nomIcone'};
    lineElement.isAPolygon = false;
    lineElement.mousePosition = {x: 100, y: 100};
    lineElement.translate = { x: 20, y: 20};
  } );

  it('should be created', () => {
    // tslint:disable-next-line:variable-name
    const Testservice: SVGStockageService = TestBed.get(SVGStockageService);
    expect(Testservice).toBeTruthy();
  });

  // TESTS addSVG

  it('#addSVG devrait attribuer la valeur de SVG à SVGHtml', () => {
    SVGHTML = sanitizer.bypassSecurityTrustHtml(drawElement.SVG);
    service.addSVG(drawElement);
    expect(drawElement.SVGHtml).toEqual(SVGHTML);
  });

  it('#addSVG devrait ajouter drawElement en paramètre à completeSVG', () => {
    service.addSVG(drawElement);
    // tslint:disable-next-line:no-string-literal
    expect(service['completeSVG'][service.size - 1]).toEqual(drawElement);
  });

  it('#addSVG devrait mettre ongoingSVG vide', () => {
    // tslint:disable-next-line:no-string-literal
    service['ongoingSVG'] = 'donnee';
    service.addSVG(drawElement);
    // tslint:disable-next-line:no-string-literal
    expect(service['ongoingSVG']).toEqual('');
  });

  it('#addSVG devrait mettre ongoingPerimeter vide', () => {
    // tslint:disable-next-line:no-string-literal
    service['ongoingPerimeter'] = 'donnee';
    service.addSVG(drawElement);
    // tslint:disable-next-line:no-string-literal
    expect(service['ongoingPerimeter']).toEqual('');
  });

  // TESTS removeSVG

  it('#removeSVG devrait appeler la fonction splice avec id et 1 en paramètre', () => {
    const idTest = service.size;
    service.addSVG(lineElement);
    // tslint:disable-next-line:no-string-literal
    spyOn(service['completeSVG'], 'splice');
    service.removeSVG(lineElement);
    // tslint:disable-next-line:no-string-literal
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
    // tslint:disable-next-line:no-string-literal
    const object = service['completeSVG'][service.size - 1];
    service.removeLastSVG();
    // tslint:disable-next-line:no-string-literal
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
    // tslint:disable-next-line:no-string-literal
    expect(service.getOngoingSVGHTML()).toEqual(service['ongoingSVG']);
  });

  // TESTS getOngoingPerimeterHTML

  it('#getOngoingPerimeterHTML devrait retourner ongoingPerimeter', () => {
    // tslint:disable-next-line:no-string-literal
    expect(service.getOngoingPerimeterHTML()).toEqual(service['ongoingPerimeter']);
  });

  // TESTS setOngoingSVG

  it('#setOngoingSVG devrait assigner SVG à setOngoingSVG', () => {
    drawElement.SVG = 'test';
    service.setOngoingSVG(drawElement);
    // tslint:disable-next-line:no-string-literal
    expect(service['ongoingSVG']).toEqual(service['sanitizer'].bypassSecurityTrustHtml(drawElement.SVG));
  });

  it('#setOngoingSVG devrait modifier ongoingPerimeter si perimeter est défini', () => {
    drawElement.perimeter = 'test';
    service.setOngoingSVG(drawElement);
    // tslint:disable-next-line:no-string-literal
    expect(service['ongoingPerimeter']).toEqual(service['sanitizer'].bypassSecurityTrustHtml(drawElement.perimeter));
  });

  // TEST getCompleteSVG

  it('#getCompleteSVG devrait retourner le tableau completeSVG', () => {
    service.addSVG(drawElement);
    service.addSVG(drawElement);
    const SVG_TEST = service.getCompleteSVG();
    // tslint:disable-next-line:no-string-literal
    expect(service['completeSVG']).toEqual(SVG_TEST);
  });

  // TESTS cleanDrawing

  it('#cleanDrawing devrait vider completeSVG', () => {
    service.addSVG(drawElement);
    service.addSVG(drawElement);
    service.cleanDrawing();
    // tslint:disable-next-line:no-string-literal
    expect(service['completeSVG']).toEqual([]);
  });

  it('#cleanDrawing devrait mettre size à 0', () => {
    service.size = 2;
    service.cleanDrawing();
    expect(service.size).toEqual(0);
  });
});
