import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class SVGStockageService {
  size: number;

  private ongoingSVG: SafeHtml;
  private ongoingPerimeter: SafeHtml;       // refactoring: plus utile en public ?
  private completeSVG: DrawElement[];

  constructor(private sanitizer: DomSanitizer) {
    this.size = 0;
    this.completeSVG = [];
  }

  addSVG(element: DrawElement): void {
    element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    this.completeSVG[this.size++] = element;
    this.ongoingSVG = '';
    this.ongoingPerimeter = '';
  }

  removeSVG(id: number): DrawElement | undefined {
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
    this.ongoingSVG = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    if (element.perimeter) {
      this.ongoingPerimeter = this.sanitizer.bypassSecurityTrustHtml(element.perimeter);
    } else {
      this.ongoingPerimeter = '';
    }
  }

  getCompleteSVG(): DrawElement[] {
    return this.completeSVG;
  }

  changePrimaryColor(id: number, color: string): string | undefined {
    const oldColor = this.completeSVG[id].primaryColor;
    if (oldColor) {
      this.completeSVG[id].primaryColor = color;
      this.completeSVG[id].draw();
      this.completeSVG[id].svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.completeSVG[id].svg);
    }
    return oldColor;
  }

  changeSecondaryColor(id: number, color: string): string | undefined {
    const oldColor = this.completeSVG[id].secondaryColor;
    if (oldColor) {
      this.completeSVG[id].secondaryColor = color;
      this.completeSVG[id].draw();
      this.completeSVG[id].svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.completeSVG[id].svg);
    }
    return oldColor;
  }

  cleanDrawing(): void {
    this.completeSVG = [];
    this.size = 0;
  }
}
