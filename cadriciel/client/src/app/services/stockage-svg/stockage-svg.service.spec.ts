import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementDessin } from './element-dessin';
import { StockageSvgService } from './stockage-svg.service';

describe('StockageSvgService', () => {
  let SVGHTML: SafeHtml;
  let perimetre: string;
  let perimetreHTML: SafeHtml;
  let element : ElementDessin;
  const SVGCompletsReference = new Map<number, ElementDessin>();
  let service: StockageSvgService;
  let sanitizer: DomSanitizer;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(StockageSvgService));
  beforeEach(() => sanitizer = TestBed.get(DomSanitizer));
  beforeEach(() => SVGHTML = sanitizer.bypassSecurityTrustHtml(
    '<path fill="transparent" stroke="black" stroke-width="1" d="M467 330 L460 300"/>'));
  beforeEach(() => perimetre = '<rect fill="transparent" stroke="gray" stroke-width="2" x="0" y="0" width="15" height="15"/>');
  beforeEach(() => perimetreHTML = sanitizer.bypassSecurityTrustHtml(perimetre));
  beforeEach(() => {
    SVGCompletsReference.set(1, element).set(2, element);
  }); // SVGHTML         perimetreHTML

  it('should be created', () => {
    const Testservice: StockageSvgService = TestBed.get(StockageSvgService);
    expect(Testservice).toBeTruthy();
  });

  // TESTS ajouterSVG
/*
  it('#ajouterSVG devrait ajouter un tag SVG dans SVGComplets', () => {
    service.ajouterSVG(element);
    expect(service.getSVGComplets().get(service.taille)).toEqual(SVGHTML);
  })*/

  it('#ajouterSVG devrait augmenter la taille', () => {
    service.taille = 1;
    service.ajouterSVG(element);
    expect(service.taille).toBe(2);
  });

  // TESTS setSVGEncours

  it('#setSVGEnCours devrait modifier SVGEnCours', () => {
    service.setSVGEnCours(element);
    expect(service.getSVGEnCoursHTML()).toEqual(SVGHTML);
  })

  it('#setSVGEnCours devrait modifier SVGEnCoursString et retirer ses 3 derniers characteres', () => {
    service.setSVGEnCours(element);
    expect(service.getSVGEnCoursHTML()).toEqual(0);
  })

  // TEST setPeremitreEnCours

  it('#setPerimetreEnCours devrait modifier le PerimetreEnCours', () => {
    service.getPerimetreEnCoursHTML();
    expect(service.getPerimetreEnCoursHTML()).toEqual(perimetreHTML);
  });

  // TEST getSVGComplets

  it('#getSVGComplets devrait retourner les SVG ajoutés convertis en HTML', () => {
    service.ajouterSVG(element);
    service.ajouterSVG(element); // perimetre
    const SVGCompletsObtenus = service.getSVGComplets();
    expect(SVGCompletsObtenus).toEqual(SVGCompletsReference);
  });

  // TESTS viderDessin

  it('#viderDessin devrait vider SVGComplets', () => {
    service.ajouterSVG(element);
    service.ajouterSVG(element); // perimetre
    service.viderDessin();
    expect(service.getSVGComplets().size).toBe(0);
  });

  it('#viderDessin devrait mettre la taille à 0', () => {
    service.taille = 2;
    service.viderDessin();
    expect(service.taille).toBe(0);
  });

  it('#viderDessin devrait supprimer le SVG en cours', () => {
    service.setSVGEnCours(element);
    service.viderDessin();
    expect(service.getSVGEnCoursHTML()).toBe('');
  });
});
