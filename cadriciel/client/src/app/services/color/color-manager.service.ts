import { Injectable } from '@angular/core';
import { ChangeBackgroundColorService } from '../command/change-background-color.service';
import { CommandManagerService } from '../command/command-manager.service';
import { ColorParameterService } from './color-parameter.service'

export enum Scope {
  Primary = 1,
  Secondary,
  Background,
  Default,
}

export const MAX_COLORS = 10;

@Injectable({
  providedIn: 'root'
})
export class ColorManagerService {
  color = 'rgba(0, 0, 0,';
  hue = 'rgba(255,255,255';
  RGB: number[] = [0, 0, 0];

  constructor(public colorParameter: ColorParameterService,
              public commands: CommandManagerService) {}

  getColor() {
    return this.color + '1)';
  }

  editRGB() {
    const newColor = 'rgba(' + this.RGB[0] + ', '
                             + this.RGB[1] + ', '
                             + this.RGB[2] + ', ';
    this.color = newColor;
  }

  applyColor(scope: Scope) {
    switch (scope) {
      case Scope.Primary:
        this.colorParameter.primaryColor = this.color;
        this.addLastColor();
        break;
      case Scope.Secondary:
        this.colorParameter.secondaryColor = this.color;
        this.addLastColor();
        break;
      case Scope.Background:
        this.commands.execute(new ChangeBackgroundColorService(this.colorParameter, this.color + '1)'));
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  addLastColor() {
    while (this.colorParameter.lastColors.length >= MAX_COLORS) {
      this.colorParameter.lastColors.shift();
    }
    this.colorParameter.lastColors.push(this.color);
  }
}
