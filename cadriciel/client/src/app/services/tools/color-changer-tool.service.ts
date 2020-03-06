import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class ColorChangerToolService implements ToolInterface {

  activeElement: DrawElement;
  activeElementID: number;

  constructor(public colorParameter: ColorParameterService,
              public stockageSVG: SVGStockageService,
              private sanitizer: DomSanitizer
              ) {
                this.activeElementID = 0;
              }

  onMouseClick(): void {
    if (this.stockageSVG.getCompleteSVG()[this.activeElementID].primaryColor) {
      this.stockageSVG.getCompleteSVG()[this.activeElementID].primaryColor = this.colorParameter.getPrimaryColor();
      this.stockageSVG.getCompleteSVG()[this.activeElementID].draw();
      this.stockageSVG.getCompleteSVG()[this.activeElementID].SVGHtml =
                  this.sanitizer.bypassSecurityTrustHtml(this.stockageSVG.getCompleteSVG()[this.activeElementID].SVG);
    }
  }

  onRightClick(): void {
    if (this.stockageSVG.getCompleteSVG()[this.activeElementID].secondaryColor) {
      this.stockageSVG.getCompleteSVG()[this.activeElementID].secondaryColor = this.colorParameter.getSecondaryColor();
      this.stockageSVG.getCompleteSVG()[this.activeElementID].draw();
      this.stockageSVG.getCompleteSVG()[this.activeElementID].SVGHtml =
                  this.sanitizer.bypassSecurityTrustHtml(this.stockageSVG.getCompleteSVG()[this.activeElementID].SVG);
    }
  }
}
