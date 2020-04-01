import { Injectable } from '@angular/core';
import { CommandManagerService } from '../command/command-manager.service';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { B, Color, G, R } from './color';
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
  color: Color;
  hue: string;

  constructor(private colorParameter: ColorParameterService,
              protected commands: CommandManagerService,
              private drawingManager: DrawingManagerService) {
    this.color = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    this.hue = 'rgba(255,255,255';
  }

  getColor(): Color {
    return this.color;
  }

  updateColor(): void {
    this.color.RGBAString = `rgba(${this.color.RGBA[R]}, ${this.color.RGBA[G]}, ${this.color.RGBA[B]}, 1)`;
  }

  applyColor(scope: Scope): void {
    switch (scope) {
      case Scope.Primary:
        this.colorParameter.primaryColor = {...this.color};
        this.addLastColor();
        break;
      case Scope.Secondary:
        this.colorParameter.secondaryColor = {...this.color};
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
