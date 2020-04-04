import { Injectable } from '@angular/core';

// import { AddSVGService } from './command/add-svg.service';
import { CommandManagerService } from './command/command-manager.service';
import { RemoveSVGService } from './command/remove-svg.service';
import { EllipseService } from './stockage-svg/draw-element/basic-shape/ellipse.service';
import { PolygonService } from './stockage-svg/draw-element/basic-shape/polygon.service';
import { RectangleService } from './stockage-svg/draw-element/basic-shape/rectangle.service';
import { DrawElement , Point } from './stockage-svg/draw-element/draw-element';
import { LineService } from './stockage-svg/draw-element/line.service';
import { SprayService } from './stockage-svg/draw-element/spray.service';
import { TraceBrushService } from './stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from './stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { SelectionService } from './tools/selection/selection.service';
import { TOOL_INDEX } from './tools/tool-manager.service';

const PASTE_OFFSET: Point = {x: 20, y: 20};

@Injectable({
  providedIn: 'root'
})

export class ClipboardService {

  private selectedElementCopy: DrawElement[];
  private removeCommand: RemoveSVGService;

  constructor(private selection: SelectionService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService
              ) {
                this.selectedElementCopy = [];
                this.removeCommand = new RemoveSVGService(this.svgStockage);
              }

  createCopyDrawElement(element: DrawElement): void {
    let newElement: TracePencilService | TraceBrushService | SprayService | RectangleService
                    | PolygonService | LineService | EllipseService;
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
      default:
        newElement = new TracePencilService();
        break;
    }
    this.setupCopy(newElement, element);
  }

  setupCopy(newElement: DrawElement, element: DrawElement): void {
    newElement.svgHtml = element.svgHtml;
    newElement.svg = element.svg;
    newElement.trueType = element.trueType;
    newElement.points = [...element.points];
    newElement.isSelected = true;
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
    newElement.pointMin = {x: element.pointMin.x, y: element.pointMin.y};
    newElement.pointMax = {x: element.pointMax.x, y: element.pointMax.y};
    newElement.translate = {x: element.translate.x, y: element.translate.y};
    this.selectedElementCopy.push(newElement);
  }

  copyDrawElementPoint(newElement: DrawElement, element: DrawElement): void {
    // TODO
  };

  copySelectedElement(): void {
    this.selectedElementCopy = [];
    for (const element of this.selection.selectedElements) {
      this.createCopyDrawElement(element);
    }
    console.log('copy');
  }

  cutSelectedElement(): void {
    this.copySelectedElement();
    this.deleteSelectedElement();
    console.log('cut');
  }

  duplicateSelectedElement(): void {
    this.copySelectedElement();
    this.pasteSelectedElement();
    console.log('duplicate');
  }

  deleteSelectedElement(): void {
    // TODO : CORRECTION UTILISATION COMMANDE REMOVE SVG
    this.removeCommand.addElements([...this.selection.selectedElements]);

    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
      this.selection.deleteBoundingBox();
    }
    console.log('delete');
  }

  pasteSelectedElement(): void {
    this.selection.deleteBoundingBox();
    for (const element of this.selectedElementCopy) {
      element.updatePosition(PASTE_OFFSET.x, PASTE_OFFSET.y);
      this.svgStockage.addSVG(element);   // TODO : UTILISATION DE LA COMMANDE ADD-SVG
      this.selection.selectedElements.push(element);
    }

    this.selection.createBoundingBox();
    console.log('paste');
  }
}
