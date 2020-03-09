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

  calculatedCenter: Point;
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
    this.polygon.primaryColor = this.colorParameter.getPrimaryColor();
    this.polygon.secondaryColor = this.colorParameter.getSecondaryColor();
    this.polygon.draw();
    this.stockageSVG.setOngoingSVG(this.polygon);
  }

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      // Calcul des valeurs pour former un polygone
      const calculatedWidth = Math.abs(this.initial.x - mouse.offsetX);
      const calculatedHeight = Math.abs(this.initial.y - mouse.offsetY);
      this.calculatedRadius = Math.min(calculatedWidth, calculatedHeight) / 2;
      this.calculatedCenter.x = this.initial.x + ((mouse.offsetX < this.initial.x) ? -1 : 1) * this.calculatedRadius;
      this.calculatedCenter.y = this.initial.y + ((mouse.offsetY < this.initial.y) ? -1 : 1) * this.calculatedRadius;
      this.polygon.points = [];
      const minPoint: Point = { x: this.calculatedCenter.x + this.calculatedRadius * Math.cos(STARTING_ANGLE), y: 0};
      const sides = (this.tools.activeTool.parameters[2].value) ? this.tools.activeTool.parameters[2].value : DEFAULT_SIDES;

      for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += (2 * Math.PI / sides)) {
        const x = this.calculatedCenter.x + this.calculatedRadius * Math.cos(angle);
        const y = this.calculatedCenter.y + this.calculatedRadius * Math.sin(angle);
        this.polygon.points.push({x, y});
        if (x < minPoint.x) {
          minPoint.x = x;
          minPoint.y = y;
        }
      }
      this.polygon.pointMin = {
        x: this.calculatedCenter.x - this.calculatedRadius,
        y: this.calculatedCenter.y - this.calculatedRadius
      };
      this.polygon.pointMax = {
        x: this.calculatedCenter.x + this.calculatedRadius,
        y: this.calculatedCenter.y + this.calculatedRadius
      };
      if (sides % 2 === 1) {
        this.calculateNewCircle(minPoint, sides);
      }
      this.refreshSVG();
    }
  }

  calculateNewCircle(minPoint: Point, sides: number): void {
    // TODO : refactoring (essayer de rendre ça moins affreux)
    const firstPoint = this.polygon.points[0];
    const newMinPoint: Point = {
      x: this.polygon.pointMin.x,
      y: firstPoint.y + ((this.polygon.pointMin.x - firstPoint.x) / (minPoint.x - firstPoint.x)) * (minPoint.y - firstPoint.y)
    };
    const x = newMinPoint.x;
    const y = newMinPoint.y;
    const a = this.calculatedCenter.x;
    const c = firstPoint.x;
    const d = firstPoint.y;
    this.calculatedRadius = (Math.sqrt((c * c) - (2 * c * x) + (d * d) - (2 * d * y) + (x * x) + (y * y))
      * (Math.sqrt((4 * a * a) - (4 * a * c) - (4 * a * x) + (c * c) + (2 * c * x) + (d * d) - (2 * d * y) + (x * x) + (y * y)))
      / (Math.sqrt((4 * d * d) - (8 * d * y) + (4 * y * y))));
    this.calculatedCenter.y = firstPoint.y + Math.sqrt(Math.pow(this.calculatedRadius, 2) - Math.pow((c - a), 2));
    this.polygon.points = [];
    for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += (2 * Math.PI / sides)) {
      const x = this.calculatedCenter.x + this.calculatedRadius * Math.cos(angle);
      const y = this.calculatedCenter.y + this.calculatedRadius * Math.sin(angle);
      this.polygon.points.push({x, y});
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
