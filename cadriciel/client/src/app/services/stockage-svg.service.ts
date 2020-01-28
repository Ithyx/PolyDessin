import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class StockageSvgService {
  SVGEnCours: string;
  taille = 0;

  private SVGComplets = new Map<number, SafeHtml>();

  ajouterSVG(SVG: string) {
    this.SVGComplets.set(this.taille + 1, this.sanitizer.bypassSecurityTrustHtml(SVG));
    ++this.taille;
  }

  getSVGComplets(): Map<number, SafeHtml> {
    return this.SVGComplets;
  }

  constructor(private sanitizer: DomSanitizer) { }
}
