import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { EllipseService } from '../stockage-svg/ellipse.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseToolService {
  ellipse: EllipseService;
  // Coordonnées du clic initial de souris
  initial: Point;
  // Coordonnées du point inférieur gauche
  calculatedBase: Point;
  // Dimensions de l'ellipse
  calculatedWidth: number;
  calculatedHeight: number;

  constructor(
              public stockageSVG: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService
  ) {
      this.ellipse = new EllipseService();
      this.initial = {x: 0, y: 0};
      this.calculatedBase = {x: 0, y: 0};
      this.calculatedWidth = 0;
      this.calculatedHeight = 0;
   }

   refreshSVG(): void {
    this.ellipse.updateParameters(this.tools.activeTool);
    this.ellipse.primaryColor = {...this.colorParameter.primaryColor};
    this.ellipse.secondaryColor = {...this.colorParameter.secondaryColor};
    this.ellipse.draw();
    this.stockageSVG.setOngoingSVG(this.ellipse);
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      // Calcule des valeurs pour former une ellipse
      this.calculatedWidth = Math.abs(this.initial.x - mouse.offsetX);
      this.calculatedHeight = Math.abs(this.initial.y - mouse.offsetY);
      this.calculatedBase.x = Math.min(this.initial.x, mouse.offsetX);
      this.calculatedBase.y = Math.min(this.initial.y, mouse.offsetY);
      // Si shift est enfoncé, les valeurs calculées sont ajustées pour former un cercle
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
    if (this.ellipse.getWidth() !== 0 || this.ellipse.getHeight() !== 0) {
      this.commands.execute(new AddSVGService(this.ellipse, this.stockageSVG));
    }
    this.calculatedBase = {x: 0, y: 0};
    this.calculatedHeight = 0;
    this.calculatedWidth = 0;
    this.ellipse = new EllipseService();
    this.stockageSVG.setOngoingSVG(this.ellipse);
  }

  shiftPress(): void {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un cercle
      if (this.calculatedWidth < this.calculatedHeight) {
        this.ellipse.points[0] = {
          x: this.calculatedBase.x,
          y: this.initial.y - ((this.calculatedBase.y === this.initial.y) ? 0 : this.calculatedWidth)
        };
        this.ellipse.points[1] = {
          x: this.calculatedBase.x + this.calculatedWidth,
          y: this.initial.y + ((this.calculatedBase.y === this.initial.y) ? this.calculatedWidth : 0)
        };
      } else {
        this.ellipse.points[0] = {
          x: this.initial.x - ((this.calculatedBase.x === this.initial.x) ? 0 : this.calculatedHeight),
          y: this.calculatedBase.y
        };
        this.ellipse.points[1] = {
          x: this.initial.x + ((this.calculatedBase.x === this.initial.x) ? this.calculatedHeight : 0),
          y: this.calculatedBase.y + this.calculatedHeight
        };
      }
      this.refreshSVG();
    }
  }

  shiftRelease(): void {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est relâchée, la forme à dessiner est une ellipse
      this.ellipse.points[0] = {x: this.calculatedBase.x, y: this.calculatedBase.y};
      this.ellipse.points[1] = {x: this.calculatedBase.x + this.calculatedWidth, y: this.calculatedBase.y + this.calculatedHeight};
      this.refreshSVG();
    }
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.ellipse = new EllipseService();
  }
}
