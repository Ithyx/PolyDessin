import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorParameterService } from '../color/color-parameter.service';
import { Color, DrawElement } from '../stockage-svg/draw-element';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class PrimaryColorChangeService implements Command {

  oldColor: Color;

  constructor(public element: DrawElement,
              public colorParameter: ColorParameterService,
              private sanitizer: DomSanitizer) {
    this.changeColor(colorParameter.primaryColor);
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
