import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class SecondaryColorChangeService implements Command {

  oldColor: string;

  constructor(public svgKey: number,
              public svgStockage: SVGStockageService,
              public colorParameter: ColorParameterService) {
    this.changeColor(colorParameter.getSecondaryColor());
  }

  undo(): void {
    this.changeColor(this.oldColor);
  }

  redo(): void {
    this.changeColor(this.oldColor);
  }

  changeColor(color: string): void {
    const oldColor = this.svgStockage.changeSecondaryColor(this.svgKey, color);
    if (oldColor) {
      this.oldColor = oldColor;
    }
  }
}
