import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { DrawingTool } from '../tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionRectangleService {
  ongoingSelection = false;
  rectangle: RectangleService;
  // Coordonnées du clic initial de souris
  initialPoint: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  basisPoint: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  widthCalculated = 0;
  heightCalculated = 0;

  rectangleSelectionTool: DrawingTool = {name: '',
                                         isActive: true,
                                         ID: -1,
                                         parameters: [
                                          {type: 'invisible', name: 'Épaisseur du contour', value: 5},
                                          {type: 'invisible', name: 'Type de tracé', choosenOption: 'Plein avec contour'}
                                         ],
                                         iconName: ''};

  constructor(private sanitizer: DomSanitizer) { }

  refreshSVG() {
    this.rectangle.tool = this.rectangleSelectionTool;
    this.rectangle.primaryColor = 'rgba(0, 80, 130, 0.35)';
    this.rectangle.secondaryColor = 'rgba(80, 80, 80, 0.45)';
    this.rectangle.draw();
    this.rectangle.SVGHtml = this.sanitizer.bypassSecurityTrustHtml(this.rectangle.SVG);
  }

  mouseMouve(mouse: MouseEvent) {
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

  mouseDown(mouse: MouseEvent) {
    this.rectangle = new RectangleService();
    this.rectangle.isDotted = true;
    this.initialPoint = {x: mouse.offsetX, y: mouse.offsetY};
    this.ongoingSelection = true;
  }

  mouseUp() {
    this.basisPoint = {x: 0, y: 0};
    this.heightCalculated = 0;
    this.widthCalculated = 0;
    this.ongoingSelection = false;
  }

}
