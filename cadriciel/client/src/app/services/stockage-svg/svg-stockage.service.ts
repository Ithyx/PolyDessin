import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class SVGStockageService {
  size: number;                             // refactoring: utilisé la taille de completeSVG ?

  private ongoingSVG: SafeHtml;
  private ongoingPerimeter: SafeHtml;       // refactoring: plus utile en public ?
  private completeSVG: DrawElement[];

  constructor(private sanitizer: DomSanitizer) {
    this.size = 0;
    this.completeSVG = [];
  }

  addSVG(element: DrawElement, key?: number): void {
    element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    // this.completeSVG.set(key ? key : ++this.size, element);
    this.completeSVG.splice(key ? key : this.getCompleteSVG.length, 0, element);
    this.ongoingSVG = '';
    this.ongoingPerimeter = '';
  }

  removeSVG(id: number): DrawElement | undefined {
    // const element = this.completeSVG.get(id);
    // this.completeSVG.delete(id);
    const element = this.completeSVG[id];
    this.completeSVG.splice(id, 1);
    this.size--;
    return element;
  }

  removeLastSVG(): void {
    this.completeSVG.pop();
    this.size--;
  }

  getOngoingSVGHTML(): SafeHtml {
    return this.ongoingSVG;
  }

  getOngoingPerimeterHTML(): SafeHtml {
    return this.ongoingPerimeter;
  }

  setOngoingSVG(element: DrawElement): void {
    this.ongoingSVG = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    if (element.perimeter) {
      this.ongoingPerimeter = this.sanitizer.bypassSecurityTrustHtml(element.perimeter);
    }
  }

  getCompleteSVG(): DrawElement[] {
    return this.completeSVG;
  }

  cleanDrawing(): void {
    this.completeSVG = [];
    this.size = 0;
  }
}
