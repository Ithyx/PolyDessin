import { Injectable } from '@angular/core';
import { ColorParameterService } from '../../color/color-parameter.service';
import { AddSVGService } from '../../command/add-svg.service';
import { CommandManagerService } from '../../command/command-manager.service';
import { BasicShapeService } from '../../stockage-svg/basic-shape/basic-shape.service';
import { Point } from '../../stockage-svg/draw-element';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { ToolInterface } from '../tool-interface';
import { ToolManagerService } from '../tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BasicShapeToolService implements ToolInterface {
  protected shape: BasicShapeService;
  // Coordonnées du clic initial de souris
  protected initial: Point;
  // Coordonnées du point inférieur gauche
  protected calculatedBase: Point;
  // Dimensions de la forme
  protected calculatedWidth: number;
  protected calculatedHeight: number;

  constructor(private stockageSVG: SVGStockageService,
              protected tools: ToolManagerService,
              private colorParameter: ColorParameterService,
              protected commands: CommandManagerService
              ) {
                this.clear();
              }

  refreshSVG(): void {
    this.shape.updateParameters(this.tools.activeTool);
    this.shape.primaryColor = {...this.colorParameter.primaryColor};
    this.shape.secondaryColor = {...this.colorParameter.secondaryColor};
    this.shape.draw();
    this.stockageSVG.setOngoingSVG(this.shape);
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
    // On évite de créer des formes vides
    if (this.shape.getWidth() !== 0 || this.shape.getHeight() !== 0) {
      this.commands.execute(new AddSVGService(this.shape, this.stockageSVG));
    }
    this.clear();
    this.stockageSVG.setOngoingSVG(this.shape);
  }

  shiftPress(): void {
    if (this.commands.drawingInProgress) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (this.calculatedWidth < this.calculatedHeight) {
        this.shape.points[0] = {
          x: this.calculatedBase.x,
          y: this.initial.y - ((this.calculatedBase.y === this.initial.y) ? 0 : this.calculatedWidth)
        };
        this.shape.points[1] = {
          x: this.calculatedBase.x + this.calculatedWidth,
          y: this.initial.y + ((this.calculatedBase.y === this.initial.y) ? this.calculatedWidth : 0)
        };
      } else {
        this.shape.points[0] = {
          x: this.initial.x - ((this.calculatedBase.x === this.initial.x) ? 0 : this.calculatedHeight),
          y: this.calculatedBase.y
        };
        this.shape.points[1] = {
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
      this.shape.points[0] = {x : this.calculatedBase.x, y: this.calculatedBase.y};
      this.shape.points[1] = {x: this.calculatedBase.x + this.calculatedWidth, y: this.calculatedBase.y + this.calculatedHeight};
      this.refreshSVG();
    }
  }

  abstract clear(): void;
}
