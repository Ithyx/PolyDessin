import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
// import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class ColorChangerToolService /*implements ToolInterface*/ {

  activeElement: DrawElement;
  activeElementID: number;

  constructor(public colorParameter: ColorParameterService,
              public SVGStockage: SVGStockageService,
              private sanitizer: DomSanitizer
              ) {
                // this.activeElementID = 0;
              }

  onMouseClick(): void {
    if (this.SVGStockage.getCompleteSVG()[this.activeElementID].primaryColor) {
      this.SVGStockage.getCompleteSVG()[this.activeElementID].primaryColor = this.colorParameter.getPrimaryColor();
      this.SVGStockage.getCompleteSVG()[this.activeElementID].draw();
      this.SVGStockage.getCompleteSVG()[this.activeElementID].SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.SVGStockage.getCompleteSVG()[this.activeElementID].SVG);
    }
  }

  onRightClick(): void {
    if (this.SVGStockage.getCompleteSVG()[this.activeElementID].secondaryColor) {
      this.SVGStockage.getCompleteSVG()[this.activeElementID].secondaryColor = this.colorParameter.getSecondaryColor();
      this.SVGStockage.getCompleteSVG()[this.activeElementID].draw();
      this.SVGStockage.getCompleteSVG()[this.activeElementID].SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.SVGStockage.getCompleteSVG()[this.activeElementID].SVG);
    }
  }
}
