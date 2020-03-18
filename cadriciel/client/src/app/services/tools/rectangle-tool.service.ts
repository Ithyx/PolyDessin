import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleToolService implements ToolInterface {
  rectangle: RectangleService;
  // Coordonnées du clic initial de souris
  initial: Point;
  // Coordonnées du point inférieur gauche
  calculatedBase: Point;
  // Dimensions du rectangle
  calculatedWidth: number;
  calculatedHeight: number;

  constructor(public stockageSVG: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService
              ) {
                this.rectangle = new RectangleService();
                this.initial = {x: 0, y: 0};
                this.calculatedBase = {x: 0, y: 0};
                this.calculatedWidth = 0;
                this.calculatedHeight = 0;
              }

  refreshSVG(): void {
    this.rectangle.updateParameters(this.tools.activeTool);
    this.rectangle.primaryColor.RGBAString = this.colorParameter.getPrimaryColor().RGBAString;
    this.rectangle.secondaryColor.RGBAString = this.colorParameter.getSecondaryColor().RGBAString;
    this.rectangle.draw();
    this.stockageSVG.setOngoingSVG(this.rectangle);
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      // Calcule des valeurs pour former un rectangle
      this.calculatedWidth = Math.abs(this.initial.x - mouse.offsetX);
      this.calculatedHeight = Math.abs(this.initial.y - mouse.offsetY);
      this.calculatedBase.x = Math.min(this.initial.x, mouse.offsetX);
      this.calculatedBase.y = Math.min(this.initial.y, mouse.offsetY);
      // Si shift est enfoncé, les valeurs calculées sont ajustées pour former un carré
      if (mouse.shiftKey) {
        this.shiftPress();
      } else {
        this.shiftRelease();
      }
    }
  }

  onMousePress(mouse: MouseEvent): void {
    if (!this.commands.drawingInProgress) {
      this.commands.drawingInProgress = true;
      this.initial = {x: mouse.offsetX, y: mouse.offsetY};
    }
  }

  onMouseRelease(): void {
    this.commands.drawingInProgress = false;
    // On évite de créer des formes vides
    if (this.rectangle.getWidth() !== 0 || this.rectangle.getHeight() !== 0) {
      this.commands.execute(new AddSVGService(this.rectangle, this.stockageSVG));
    }
    this.calculatedBase = {x: 0, y: 0};
    this.calculatedHeight = 0;
    this.calculatedWidth = 0;
    this.rectangle = new RectangleService();
    this.stockageSVG.setOngoingSVG(this.rectangle);
  }

  shiftPress(): void {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (this.calculatedWidth < this.calculatedHeight) {
        this.rectangle.points[0] = {
          x: this.calculatedBase.x,
          y: this.initial.y - ((this.calculatedBase.y === this.initial.y) ? 0 : this.calculatedWidth)
        };
        this.rectangle.points[1] = {
          x: this.calculatedBase.x + this.calculatedWidth,
          y: this.initial.y + ((this.calculatedBase.y === this.initial.y) ? this.calculatedWidth : 0)
        };
      } else {
        this.rectangle.points[0] = {
          x: this.initial.x - ((this.calculatedBase.x === this.initial.x) ? 0 : this.calculatedHeight),
          y: this.calculatedBase.y
        };
        this.rectangle.points[1] = {
          x: this.initial.x + ((this.calculatedBase.x === this.initial.x) ? this.calculatedHeight : 0),
          y: this.calculatedBase.y + this.calculatedHeight
        };
      }
      this.refreshSVG();
    }
  }

  shiftRelease(): void {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est relâchée, la forme à dessiner est un rectangle
      this.rectangle.points[0] = {x : this.calculatedBase.x, y: this.calculatedBase.y};
      this.rectangle.points[1] = {x: this.calculatedBase.x + this.calculatedWidth, y: this.calculatedBase.y + this.calculatedHeight};
      this.refreshSVG();
    }
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.rectangle = new RectangleService();
  }
}
