import { Injectable } from '@angular/core';
import { PolygonService } from '../../stockage-svg/polygon.service';
import { Point } from '../line-tool.service';
import { BasicShapeToolService } from './basic-shape-tool.service';

export const DEFAULT_SIDES = 6;
export const STARTING_ANGLE = -Math.PI / 2;
export const ENDING_ANGLE = 2 * Math.PI + STARTING_ANGLE;

@Injectable({
  providedIn: 'root'
})
export class PolygonToolService extends BasicShapeToolService {
  // Point avec la coordonnée en x minimale
  private minPoint: Point;

  private calculatedCenter: Point;
  private calculatedRadius: number;

  onMouseMove(mouse: MouseEvent): void {
    if (this.commands.drawingInProgress) {
      // Calcul des valeurs pour former un polygone
      const calculatedWidth = Math.abs(this.initial.x - mouse.offsetX);
      const calculatedHeight = Math.abs(this.initial.y - mouse.offsetY);
      this.calculatedRadius = Math.min(calculatedWidth, calculatedHeight) / 2;
      this.calculatedCenter.x = this.initial.x + ((mouse.offsetX < this.initial.x) ? -1 : 1) * this.calculatedRadius;
      this.calculatedCenter.y = this.initial.y + ((mouse.offsetY < this.initial.y) ? -1 : 1) * this.calculatedRadius;
      this.minPoint = {x: this.calculatedCenter.x, y: 0};
      const sides = (this.tools.activeTool.parameters[2].value) ? this.tools.activeTool.parameters[2].value : DEFAULT_SIDES;

      this.calculatePoints(sides);
      this.shape.pointMin = {
        x: this.calculatedCenter.x - this.calculatedRadius,
        y: this.calculatedCenter.y - this.calculatedRadius
      };
      this.shape.pointMax = {
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
    this.shape.points = [];
    for (let angle = STARTING_ANGLE; angle < ENDING_ANGLE; angle += (2 * Math.PI / sides)) {
      const x = this.calculatedCenter.x + this.calculatedRadius * Math.cos(angle);
      const y = this.calculatedCenter.y + this.calculatedRadius * Math.sin(angle);
      this.shape.points.push({x, y});
      if (x < this.minPoint.x) {
        this.minPoint.x = x;
        this.minPoint.y = y;
      }
    }
  }

  calculateNewCircle(): void {
    const firstPoint = this.shape.points[0];
    // Interpolation linéaire pour rapporter le point avec un x minimal directement sur la boîte de sélection
    const newMinPoint: Point = {
      x: this.shape.pointMin.x,
      y: firstPoint.y + ((this.shape.pointMin.x - firstPoint.x) / (this.minPoint.x - firstPoint.x)) * (this.minPoint.y - firstPoint.y)
    };
    this.calculatedRadius = this.calculateRadius(this.calculatedCenter.x, firstPoint.y, newMinPoint.x, newMinPoint.y);
    this.calculatedCenter.y = firstPoint.y + this.calculatedRadius;
  }

  // Calcul du nouveau rayon du cercle avec un centre (a,b), où b est inconnu, en résolvant l'équation
  // du cercle (x-a)^2 + (y-b)^2 = r^2 pour (x0,y0), le premier point du polygone
  // et (x,y), le nouveau point minimum en x, ce qui donne l'équation (x-a)^2 + (y-(y0-r))^2 = r^2
  // qui est résolue en isolant r avec l'aide de WolframAlpha :
  // https://www.wolframalpha.com/input/?i=solve+%28x-a%29%5E2+%2B+%28y-%28y_0-r%29%29%5E2+%3D+r%5E2+for+r
  calculateRadius(a: number, y0: number, x: number, y: number): number {
    return ((a * a) - (2 * a * x) + (x * x) + (y * y) + (y0 * y0) - (2 * y * y0)) / (2 * (y - y0));
  }

  clear(): void {
    this.commands.drawingInProgress = false;
    this.shape = new PolygonService();
    this.initial = {x: 0, y: 0};
    this.calculatedCenter = {x: 0, y: 0};
    this.calculatedRadius = 0;
  }
}
