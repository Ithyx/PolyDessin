import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StockageSvgService } from './stockage-svg.service';

describe('StockageSvgService', () => {
  let SVG: string ;
  let SVGHTML: SafeHtml;
  let service: StockageSvgService;
  let sanitizer: DomSanitizer;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(StockageSvgService));
  beforeEach(() => SVG = '<path fill="transparent" stroke="black" stroke-width="1" d="M467 330 L460 300"/>');
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));
  beforeEach(() => SVGHTML = sanitizer.bypassSecurityTrustHtml(
    '<path fill="transparent" stroke="black" stroke-width="1" d="M467 330 L460 300"/>'));

  it('should be created', () => {
    const Testservice: StockageSvgService = TestBed.get(StockageSvgService);
    expect(Testservice).toBeTruthy();
  });

  it('ajouterSVG should add a SVG HTML in SVGComplets and have a taille of 1 ', () => {
    service.ajouterSVG(SVG);
    expect(service.getSVGComplets().get(service.taille)).toEqual(SVGHTML);
    expect(service.taille).toBe(1);
  })

  it('setSVGEnCours should modify SVGEnCours and SVGEnCoursString', () => {
    service.setSVGEnCours(SVG);
    expect(service.getSVGEnCoursHTML()).toEqual(SVGHTML);
    expect(service.getSVGEnCours()).toEqual(SVG.slice(0, -3));      // Meilleur variable autre que SVG.slice(0,-3) ?
  })

});
