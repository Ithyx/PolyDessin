import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class SVGStockageService {
  size = 0;

  private ongoingSVG: SafeHtml;
  private ongoingPerimeter: SafeHtml;
  private completeSVG = new Map<number, DrawElement>();

  addSVG(element: DrawElement, key?: number) {
    element.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    this.completeSVG.set(key ? key : ++this.size, element);
    this.ongoingSVG = '';
    this.ongoingPerimeter = '';
  }

  removeSVG(key: number): DrawElement | undefined {
    const element = this.completeSVG.get(key);
    this.completeSVG.delete(key);
    this.size--;
    return element;
  }

  removeLastSVG() {
    this.completeSVG.delete(this.size);
    this.size--;
  }

  getOngoingSVGHTML(): SafeHtml {
    return this.ongoingSVG;
  }

  getOngoingPerimeterHTML(): SafeHtml {
    return this.ongoingPerimeter;
  }

  setOngoingSVG(element: DrawElement) {
    this.ongoingSVG = this.sanitizer.bypassSecurityTrustHtml(element.SVG);
    if (element.perimeter) {
      this.ongoingPerimeter = this.sanitizer.bypassSecurityTrustHtml(element.perimeter);
    }
  }

  getCompleteSVG(): Map<number, DrawElement> {
    return this.completeSVG;
  }

  cleanDrawing() {
    this.completeSVG.clear();
    this.size = 0;
  }

  constructor(private sanitizer: DomSanitizer) { }
}
