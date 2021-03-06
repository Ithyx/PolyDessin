import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Color } from '../color/color';
import { ColorParameterService } from '../color/color-parameter.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class PrimaryColorChangeService implements Command {

  private oldColor: Color;

  constructor(private element: DrawElement,
              private colorParameter: ColorParameterService,
              private sanitizer: DomSanitizer) {
    this.changeColor(this.colorParameter.primaryColor);
  }

  undo(): void {
    this.changeColor(this.oldColor);
  }

  redo(): void {
    this.changeColor(this.oldColor);
  }

  changeColor(color: Color): void {
    if (this.element.primaryColor) {
      this.oldColor = this.element.primaryColor;
    }
    this.element.primaryColor = color;
    this.element.draw();
    this.element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.element.svg);
  }
}
