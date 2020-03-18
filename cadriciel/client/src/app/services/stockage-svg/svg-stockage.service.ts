import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TOOL_INDEX, ToolManagerService } from '../tools/tool-manager.service';
import { DrawElement } from './draw-element';

@Injectable({
  providedIn: 'root'
})
export class SVGStockageService {
  size: number;

  private ongoingSVG: SafeHtml;
  private ongoingPerimeter: SafeHtml;       // refactoring: plus utile en public ?
  private completeSVG: DrawElement[];

  constructor(private sanitizer: DomSanitizer,
              private tools: ToolManagerService) {
    this.size = 0;
    this.completeSVG = [];
  }

  addSVG(element: DrawElement): void {
    element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    this.completeSVG[this.size++] = element;
    if (this.tools.activeTool.ID !== TOOL_INDEX.ERASER) {
      this.ongoingSVG = '';
    }
    this.ongoingPerimeter = '';
  }

  removeSVG(element: DrawElement): void {
    this.completeSVG.splice(this.completeSVG.indexOf(element), 1);
    this.size--;
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

  cleanDrawing(): void {
    this.completeSVG = [];
    this.size = 0;
  }
}
