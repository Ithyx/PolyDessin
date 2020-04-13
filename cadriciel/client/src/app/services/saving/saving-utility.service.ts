import { Injectable } from '@angular/core';
import { EllipseService } from '../stockage-svg/draw-element/basic-shape/ellipse.service';
import { PolygonService } from '../stockage-svg/draw-element/basic-shape/polygon.service';
import { RectangleService } from '../stockage-svg/draw-element/basic-shape/rectangle.service';
import { ColorFillService } from '../stockage-svg/draw-element/color-fill.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SprayService } from '../stockage-svg/draw-element/spray.service';
import { TraceBrushService } from '../stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';

import { TOOL_INDEX } from '../tools/tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SavingUtilityService {

  constructor(private stockageSVG: SVGStockageService) { }

  addElement(element: DrawElement): void {
    let newElement: TracePencilService | TraceBrushService | SprayService | RectangleService
                    | PolygonService | LineService | EllipseService | ColorFillService;
    switch (element.trueType) {
      case TOOL_INDEX.PENCIL:
        newElement = new TracePencilService();
        break;
      case TOOL_INDEX.BRUSH:
        newElement = new TraceBrushService();
        break;
      case TOOL_INDEX.SPRAY:
        newElement = new SprayService();
        break;
      case TOOL_INDEX.RECTANGLE:
        newElement = new RectangleService();
        break;
      case TOOL_INDEX.POLYGON:
        newElement = new PolygonService();
        break;
      case TOOL_INDEX.LINE:
        newElement = new LineService();
        newElement.mousePosition = (element as LineService).mousePosition;
        break;
      case TOOL_INDEX.ELLIPSE:
        newElement = new EllipseService();
        break;
      case TOOL_INDEX.PAINT_BUCKET:
        newElement = new ColorFillService();
        break;
      default:
        newElement = new TracePencilService();
        break;
    }
    this.setupElement(newElement, element);
  }

  setupElement(newElement: DrawElement, element: DrawElement): void {
    newElement.svgHtml = element.svgHtml;
    newElement.svg = element.svg;
    newElement.trueType = element.trueType;
    newElement.points = element.points;
    // newElement.isSelected = element.isSelected;
    newElement.erasingEvidence = element.erasingEvidence;
    if (element.primaryColor !== undefined) { newElement.primaryColor = element.primaryColor; }
    if (element.secondaryColor !== undefined) { newElement.secondaryColor = element.secondaryColor; }
    newElement.erasingColor = element.erasingColor;
    if (element.thickness !== undefined) { newElement.thickness = element.thickness; }
    if (element.thicknessLine !== undefined) { newElement.thicknessLine = element.thicknessLine; }
    if (element.thicknessPoint !== undefined) { newElement.thicknessPoint = element.thicknessPoint; }
    if (element.texture !== undefined) { newElement.texture = element.texture; }
    if (element.perimeter !== undefined) { newElement.perimeter = element.perimeter; }
    if (element.isAPoint !== undefined) { newElement.isAPoint = element.isAPoint; }
    if (element.isDotted !== undefined) { newElement.isDotted = element.isDotted; }
    if (element.chosenOption !== undefined) { newElement.chosenOption = element.chosenOption; }
    if (element.isAPolygon !== undefined) { newElement.isAPolygon = element.isAPolygon; }
    newElement.pointMin = element.pointMin;
    newElement.pointMax = element.pointMax;
    newElement.transform = element.transform;
    this.stockageSVG.addSVG(newElement);
  }
}
