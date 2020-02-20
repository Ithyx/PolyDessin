import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ElementDessin } from './element-dessin';

@Injectable({
  providedIn: 'root'
})
export class StockageSvgService {
  taille = 0;

  private SVGEnCours: SafeHtml;
  private perimetreEnCours: SafeHtml;
  private elementsComplets = new Map<number, ElementDessin>();

  ajouterSVG(element: ElementDessin, cle?: number) {
    element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    this.elementsComplets.set(cle ? cle : ++this.taille, element);
    this.SVGEnCours = '';
    this.perimetreEnCours = '';
  }

  retirerSVG(cle: number): ElementDessin | undefined {
    const element = this.elementsComplets.get(cle);
    this.elementsComplets.delete(cle);
    this.taille--;
    return element;
  }

  retirerDernierSVG() {
    this.elementsComplets.delete(this.taille);
    this.taille--;
  }

  getSVGEnCoursHTML(): SafeHtml {
    return this.SVGEnCours;
  }

  getPerimetreEnCoursHTML(): SafeHtml {
    return this.perimetreEnCours;
  }

  setSVGEnCours(element: ElementDessin) {
    this.SVGEnCours = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    if (element.perimetre) {
      this.perimetreEnCours = this.sanitizer.bypassSecurityTrustHtml(element.perimetre);
    }
  }

  getSVGComplets(): Map<number, ElementDessin> {
    return this.elementsComplets;
  }

  viderDessin() {
    this.elementsComplets.clear();
    this.taille = 0;
  }

  constructor(private sanitizer: DomSanitizer) { }
}
