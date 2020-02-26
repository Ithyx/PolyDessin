import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface'
import { ToolManagerService } from './tool-manager.service'

@Injectable({
  providedIn: 'root'
})
export class RectangleToolService implements ToolInterface {
  rectangle = new RectangleService();
  // Coordonnées du clic initial de souris
  initial: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  calculatedBase: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  calculatedWidth = 0;
  calculatedHeight = 0;

  constructor(public stockageSVG: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService) { }

  refreshSVG() {
    this.rectangle.tool = this.tools.activeTool;
    this.rectangle.primaryColor = this.colorParameter.getPrimaryColor();
    this.rectangle.secondaryColor = this.colorParameter.getSecondaryColor();
    this.rectangle.draw();
    this.stockageSVG.setOngoingSVG(this.rectangle);
  }

  onMouseMove(mouse: MouseEvent) {
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

  onMousePress(mouse: MouseEvent) {
    if (!this.commands.drawingInProgress) {
      this.commands.drawingInProgress = true;
      this.initial = {x: mouse.offsetX, y: mouse.offsetY};
    }
  }

  onMouseRelease() {
    this.commands.drawingInProgress = false;
    // On évite de créer des formes vides
    if (this.rectangle.getWidth() !== 0 || this.rectangle.getHeight() !== 0) {
      this.commands.execute(new AddSVGService(this.rectangle, this.stockageSVG));
    }
    this.calculatedBase = {x: 0, y: 0};
    this.calculatedHeight = 0;
    this.calculatedWidth = 0;
    this.rectangle = new RectangleService();
  }

  shiftPress() {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (this.calculatedWidth < this.calculatedHeight) {
        this.rectangle.points[0].y = (this.calculatedBase.y === this.initial.y) ?
          this.calculatedBase.y : (this.calculatedBase.y + (this.calculatedHeight - this.calculatedWidth));
        this.rectangle.points[0].x = this.calculatedBase.x;
        this.rectangle.points[1] = {x: this.calculatedBase.x + this.calculatedWidth, y: this.calculatedBase.y + this.calculatedWidth};

      } else {
        this.rectangle.points[0].x = (this.calculatedBase.x === this.initial.x) ?
          this.calculatedBase.x : (this.calculatedBase.x + (this.calculatedWidth - this.calculatedHeight));
        this.rectangle.points[0].y = this.calculatedBase.y;
        this.rectangle.points[1] = {x: this.calculatedBase.x + this.calculatedHeight, y: this.calculatedBase.y + this.calculatedHeight};
      }
      this.refreshSVG();
    }
  }

  shiftRelease() {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est relâchée, la forme à dessiner est un rectangle
      this.rectangle.points[0] = this.calculatedBase;
      this.rectangle.points[1] = {x: this.calculatedBase.x + this.calculatedWidth, y: this.calculatedBase.y + this.calculatedHeight};
      this.refreshSVG();
    }
  }

  clear() {
    this.commands.drawingInProgress = false;
    this.rectangle = new RectangleService();
  }
}
