import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { DrawElement } from '../stockage-svg/draw-element';
import { EllipseService } from '../stockage-svg/ellipse.service';
import { LineService } from '../stockage-svg/line.service';
import { PolygonService } from '../stockage-svg/polygon.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { TraceSprayService } from '../stockage-svg/trace-spray.service';
import { TOOL_INDEX } from '../tools/tool-manager.service';

export enum SERVER_URL {
  POST = 'http://localhost:3000/api/db/saveDrawing',
  GET = 'http://localhost:3000/api/db/listDrawings',
  DELETE = 'http://localhost:3000/api/db/deleteDrawing'
}
const ID_MAX = 1000000000;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient,
              private stockageSVG: SVGStockageService,
              private drawingParams: DrawingManagerService) {}

  async saveDrawing(): Promise<void> {
    if (this.drawingParams.id === 0) { this.drawingParams.id = Math.floor(Math.random() * ID_MAX); }
    const drawing: Drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: this.drawingParams.tags,
      elements: this.stockageSVG.getCompleteSVG()
    };
    await this.http.post(SERVER_URL.POST, drawing).toPromise();
  }

  addElement(element: DrawElement): void {
    let newElement: TracePencilService | TraceBrushService | TraceSprayService | RectangleService
                    | PolygonService | LineService | EllipseService;
    switch (element.trueType) {
      case TOOL_INDEX.PENCIL:
        newElement = new TracePencilService();
        break;
      case TOOL_INDEX.BRUSH:
        newElement = new TraceBrushService();
        break;
      case TOOL_INDEX.SPRAY:
        newElement = new TraceSprayService();
        break;
      case TOOL_INDEX.RECTANGLE:
        newElement = new RectangleService();
        break;
      case TOOL_INDEX.POLYGON:
        newElement = new PolygonService();
        break;
      case TOOL_INDEX.LINE:
        newElement = new LineService();
        newElement.mousePosition = element.points[Math.max(element.points.length - 1, 0)];
        break;
      case TOOL_INDEX.ELLIPSE:
        newElement = new EllipseService();
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
    newElement.isSelected = element.isSelected;
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
    newElement.translate = element.translate;
    this.stockageSVG.addSVG(newElement);
  }

  async getData(): Promise<Drawing[]> {
    return await this.http.get<Drawing[]>(SERVER_URL.GET).toPromise();
  }

  async getDataWithTags(tags: string[]): Promise<Drawing[]> {
    return await this.http.get<Drawing[]>(SERVER_URL.GET + '?tags=' + encodeURIComponent(JSON.stringify(tags))).toPromise();
  }

  async deleteDrawing(id: number): Promise<void> {
    await this.http.delete(SERVER_URL.DELETE + '?id=' + id.toString()).toPromise();
  }
}
