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
  // Point avec la coordonnée en x minimale
  minPoint: Point;

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
    this.polygon.primaryColor = {...this.colorParameter.primaryColor};
    this.polygon.secondaryColor = {...this.colorParameter.secondaryColor};
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
      this.minPoint = { x: this.calculatedCenter.x + this.calculatedRadius * Math.cos(STARTING_ANGLE), y: 0};
      const sides = (this.tools.activeTool.parameters[2].value) ? this.tools.activeTool.parameters[2].value : DEFAULT_SIDES;

      this.calculatePoints(sides);
      this.polygon.pointMin = {
        x: this.calculatedCenter.x - this.calculatedRadius,
        y: this.calculatedCenter.y - this.calculatedRadius
      };
      this.polygon.pointMax = {
        x: this.calculatedCenter.x + this.calculatedRadius,
        y: this.calculatedCenter.y + this.calculatedRadius
      };
      if (sides % 2 === 1) {
        this.calculateNewCircle();
        if (!isNaN(this.calculatedCenter.y)) {
          this.calculatePoints(sides);
        }
      }
      this.refreshSVG();
    }
  }

  calculatePoints(sides: number): void {
    this.polygon.points = [];
    for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += (2 * Math.PI / sides)) {
      const x = this.calculatedCenter.x + this.calculatedRadius * Math.cos(angle);
      const y = this.calculatedCenter.y + this.calculatedRadius * Math.sin(angle);
      this.polygon.points.push({x, y});
      if (x < this.minPoint.x) {
        this.minPoint.x = x;
        this.minPoint.y = y;
      }
    }
  }

  calculateNewCircle(): void {
    const firstPoint = this.polygon.points[0];
    // Interpolation linéaire pour rapporter le point avec un x minimal directement sur la boîte de sélection
    const newMinPoint: Point = {
      x: this.polygon.pointMin.x,
      y: firstPoint.y + ((this.polygon.pointMin.x - firstPoint.x) / (this.minPoint.x - firstPoint.x)) * (this.minPoint.y - firstPoint.y)
    };
    this.calculatedRadius = this.calculateRadius(this.calculatedCenter.x, firstPoint.x, firstPoint.y, newMinPoint.x, newMinPoint.y);
    // Calculer la coordonnée en y du centre en l'isolant de l'équation du cercle
    this.calculatedCenter.y = firstPoint.y +
      Math.sqrt(Math.pow(this.calculatedRadius, 2) - Math.pow((firstPoint.x - this.calculatedCenter.x), 2));
  }

  // Calcul du nouveau rayon du cercle avec un centre (a,b), où b est inconnu, en résolvant l'équation
  // du cercle (x-a)^2 + (y-b)^2 = r^2 pour (x0,y0), le premier point du polygone
  // et (x,y), le nouveau point minimum en x, ce qui donne l'équation (x-a)^2 + (y-(y0-sqrt(r^2 - (x0-a)^2)))^2 = r^2
  // qui est résolue en isolant r avec l'aide de WolframAlpha :
  // https://www.wolframalpha.com/input/?i=solve+%28x-a%29%5E2+%2B+%28y-%28y_0-sqrt%28r%5E2+-+%28x_0-a%29%5E2%29%29%29%5E2+%3D+r%5E2+for+r
  // L'utilisation de constantes dans l'équation nous oblige à désactiver tslint pour les nombres magiques
  calculateRadius(a: number, x0: number, y0: number, x: number, y: number): number {
    // tslint:disable: no-magic-numbers
    return (Math.sqrt((x0 * x0) - (2 * x0 * x) + (y0 * y0) - (2 * y0 * y) + (x * x) + (y * y))
      * (Math.sqrt((4 * a * a) - (4 * a * x0) - (4 * a * x) + (x0 * x0) + (2 * x0 * x) + (y0 * y0) - (2 * y0 * y) + (x * x) + (y * y)))
      / (Math.sqrt((4 * y0 * y0) - (8 * y0 * y) + (4 * y * y))));
    // tslint:enable: no-magic-numbers
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
