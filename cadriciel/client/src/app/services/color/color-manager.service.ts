import { Injectable } from '@angular/core';
import { CommandManagerService } from '../command/command-manager.service';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { ColorParameterService } from './color-parameter.service';

export enum Scope {
  Primary = 1,
  Secondary,
  BackgroundNewDrawing,
  BackgroundToolBar,
  Default,
}

export const MAX_COLORS = 10;

@Injectable({
  providedIn: 'root'
})
export class ColorManagerService {
  color: string;
  hue: string;
  RGB: number[] = [0, 0, 0];

  constructor(public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              public drawingManager: DrawingManagerService) {
    this.color = 'rgba(0, 0, 0,';
    this.hue = 'rgba(255,255,255';
  }

  getColor(): string {
    return this.color + '1)';
  }

  editRGB(): void {
    const newColor = 'rgba(' + this.RGB[0] + ', '
                             + this.RGB[1] + ', '
                             + this.RGB[2] + ', ';
    this.color = newColor;
  }

  applyColor(scope: Scope): void {
    switch (scope) {
      case Scope.Primary:
        this.colorParameter.primaryColor = this.color;
        this.addLastColor();
        break;
      case Scope.Secondary:
        this.colorParameter.secondaryColor = this.color;
        this.addLastColor();
        break;
      case Scope.BackgroundNewDrawing:
        this.colorParameter.temporaryBackgroundColor = this.getColor();
        break;
      case Scope.BackgroundToolBar:
        this.drawingManager.backgroundColor = this.getColor();
        this.colorParameter.temporaryBackgroundColor = this.getColor();
      default:
        /* Par mesure de sécurité, ne rien faire. */
        break;
    }
  }

  addLastColor(): void {
    while (this.colorParameter.lastColors.length >= MAX_COLORS) {
      this.colorParameter.lastColors.shift();
    }
    this.colorParameter.lastColors.push(this.color);
  }
}
