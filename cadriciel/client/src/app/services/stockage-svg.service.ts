import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class StockageSvgService {
  taille = 0;

  private SVGEnCoursString = '';
  private SVGEnCours: SafeHtml;
  private PerimetreEnCours: SafeHtml;
  private SVGComplets = new Map<number, SafeHtml>();

  ajouterSVG(SVG: string) {
    this.SVGComplets.set(this.taille + 1, this.sanitizer.bypassSecurityTrustHtml(SVG));
    ++this.taille;
  }

  getSVGEnCours(): string {
    // Slicé pour enlevé le '"/>' à la fin
    return this.SVGEnCoursString.slice(0, -3);
  }

  getSVGEnCoursHTML(): SafeHtml {
    return this.SVGEnCours
  }

  getPerimetreEnCoursHTML(): SafeHtml {
    return this.PerimetreEnCours
  }

  setSVGEnCours(SVG: string) {
    this.SVGEnCoursString = SVG;
    this.SVGEnCours = this.sanitizer.bypassSecurityTrustHtml(SVG);
  }

  setPerimetreEnCours(SVG: string) {
    this.PerimetreEnCours = this.sanitizer.bypassSecurityTrustHtml(SVG);
  }

  getSVGComplets(): Map<number, SafeHtml> {
    return this.SVGComplets;
  }

  viderDessin() {
    console.log()
    this.SVGComplets.clear();
    this.taille = 0;
    /* Ne devrait pas être nécessaire, mais par mesure de sécurité */
    this.setSVGEnCours('');
  }

  constructor(private sanitizer: DomSanitizer) { }
}
