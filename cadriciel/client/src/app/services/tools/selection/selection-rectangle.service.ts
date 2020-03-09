import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { DrawingTool } from '../tool-manager.service';

const rectangleSelectionTool: DrawingTool = {name: '',
                                             isActive: true,
                                             ID: -1,
                                             parameters: [
                                              {type: 'invisible', name: 'Épaisseur du contour', value: 3},
                                              {type: 'invisible', name: 'Type de tracé', chosenOption: 'Plein avec contour'}
                                            ],
                                             iconName: ''};

@Injectable({
  providedIn: 'root'
})

export class SelectionRectangleService {
  ongoingSelection: boolean;
  rectangle: RectangleService;

  initialPoint: Point;   // Coordonnées du clic initial de souris
  basisPoint: Point;     // Coordonnées du point inférieur gauche

  // Dimensions du rectangle
  widthCalculated: number;
  heightCalculated: number;

  constructor(private sanitizer: DomSanitizer) {
    this.ongoingSelection = false;
    this.initialPoint = {x: 0, y: 0};
    this.basisPoint = {x: 0, y: 0};
    this.widthCalculated = 0;
    this.heightCalculated = 0;
   }

  refreshSVG(): void {
    this.rectangle.updateParameters(rectangleSelectionTool);
    this.rectangle.primaryColor = 'rgba(0, 80, 130, 0.35)';
    this.rectangle.secondaryColor = 'rgba(80, 80, 80, 0.45)';
    this.rectangle.draw();
    this.rectangle.svgHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.svg);
  }

  mouseMove(mouse: MouseEvent): void {
    if (this.ongoingSelection) {
      // Calcule des valeurs pour former un rectangle
      this.widthCalculated = Math.abs(this.initialPoint.x - mouse.offsetX);
      this.heightCalculated = Math.abs(this.initialPoint.y - mouse.offsetY);

      this.basisPoint = {x: Math.min(this.initialPoint.x, mouse.offsetX), y: Math.min(this.initialPoint.y, mouse.offsetY)};

      this.rectangle.points[0] = this.basisPoint;
      this.rectangle.points[1] = {x: this.basisPoint.x + this.widthCalculated, y: this.basisPoint.y + this.heightCalculated};

      this.refreshSVG();
    }
  }

  mouseDown(mouse: MouseEvent): void {
    this.rectangle = new RectangleService();
    this.rectangle.isDotted = true;
    this.initialPoint = {x: mouse.offsetX, y: mouse.offsetY};
    this.ongoingSelection = true;
  }

  mouseUp(): void {
    this.basisPoint = {x: 0, y: 0};
    this.heightCalculated = 0;
    this.widthCalculated = 0;
    this.ongoingSelection = false;
  }

}
