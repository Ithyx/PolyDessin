import { Injectable } from '@angular/core';
import { ColorParameterService } from '../color/color-parameter.service';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { PolygonService } from '../stockage-svg/polygon.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

export const DEFAULT_SIDES = 6;
export const STARTING_ANGLE = -Math.PI / 2;
export const ENDING_ANGLE = 2 * Math.PI + STARTING_ANGLE;

@Injectable({
  providedIn: 'root'
})
export class PolygonToolService implements ToolInterface {
  polygon: PolygonService;
  // Coordonnées du clic initial de souris
  initial: Point;
  // Coordonnées du point inférieur gauche
  calculatedCenter: Point;
  // Dimensions du rectangle
  calculatedRadius: number;

  constructor(public stockageSVG: SVGStockageService,
              public tools: ToolManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService
              ) {
                this.polygon = new PolygonService();
                this.initial = {x: 0, y: 0};
                this.calculatedCenter = {x: 0, y: 0};
                this.calculatedRadius = 0;
              }

  refreshSVG(): void {
    this.polygon.updateParameters(this.tools.activeTool);
    this.polygon.primaryColor.RGBAString = this.colorParameter.getPrimaryColor().RGBAString;
    this.polygon.secondaryColor.RGBAString = this.colorParameter.getSecondaryColor().RGBAString;
    this.polygon.draw();
    this.stockageSVG.setOngoingSVG(this.polygon);
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      // Calcule des valeurs pour former un polygone
      const calculatedWidth = Math.abs(this.initial.x - mouse.offsetX);
      const calculatedHeight = Math.abs(this.initial.y - mouse.offsetY);
      this.calculatedRadius = Math.min(calculatedWidth, calculatedHeight) / 2;
      this.calculatedCenter.x = this.initial.x + ((mouse.offsetX < this.initial.x) ? -1 : 1) * this.calculatedRadius;
      this.calculatedCenter.y = this.initial.y + ((mouse.offsetY < this.initial.y) ? -1 : 1) * this.calculatedRadius;
      const sides = (this.tools.activeTool.parameters[2].value) ? this.tools.activeTool.parameters[2].value : DEFAULT_SIDES;
      this.polygon.points = [];
      for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += (2 * Math.PI / sides)) {
        const x = this.calculatedCenter.x + this.calculatedRadius * Math.cos(angle);
        const y = this.calculatedCenter.y + this.calculatedRadius * Math.sin(angle);
        this.polygon.points.push({x, y});
      }
      this.polygon.pointMin = {
        x: this.calculatedCenter.x - this.calculatedRadius,
        y: this.calculatedCenter.y - this.calculatedRadius
      };
      this.polygon.pointMax = {
        x: this.calculatedCenter.x + this.calculatedRadius,
        y: this.calculatedCenter.y + this.calculatedRadius
      };
      this.refreshSVG();
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
    if (this.polygon.getWidth() !== 0 || this.polygon.getHeight() !== 0) {
      this.commands.execute(new AddSVGService(this.polygon, this.stockageSVG));
      console.log(this.polygon);
    }
    this.calculatedCenter = {x: 0, y: 0};
    this.calculatedRadius = 0;
    this.polygon = new PolygonService();
    this.stockageSVG.setOngoingSVG(this.polygon);
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.polygon = new PolygonService();
  }
}
