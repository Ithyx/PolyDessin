import { Injectable } from '@angular/core';

import { AddSVGService } from './command/add-svg.service';
import { CommandManagerService } from './command/command-manager.service';
import { RemoveSVGService } from './command/remove-svg.service';
import { DrawingManagerService } from './drawing-manager/drawing-manager.service';
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

  private copiedElements: DrawElement[];
  private duplicatedElements: DrawElement[];
  private removeCommand: RemoveSVGService;
  private numberOfPaste: number;

  constructor(private selection: SelectionService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService,
              private drawing: DrawingManagerService
              ) {
                this.numberOfPaste = 0;
                this.copiedElements = [];
                this.duplicatedElements = [];
                this.removeCommand = new RemoveSVGService(this.svgStockage);
              }

  createCopyDrawElement(element: DrawElement, array: DrawElement[]): void {
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
    this.setupCopy(newElement, element, array);
  }

  setupCopy(newElement: DrawElement, element: DrawElement, array: DrawElement[]): void {
    newElement.svgHtml = element.svgHtml;
    newElement.svg = element.svg;
    newElement.trueType = element.trueType;
    newElement.points = [];
    for (const point of element.points) {
      newElement.points.push({x: point.x, y: point.y});
    }
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
    array.push(newElement);
  }

  copySelectedElement(): void {
    this.copiedElements = [];
    this.numberOfPaste = 0;
    for (const element of this.selection.selectedElements) {
      this.createCopyDrawElement(element, this.copiedElements);
    }
    console.log('copy', this.copiedElements);
  }

  cutSelectedElement(): void {
    this.copySelectedElement();
    this.deleteSelectedElement();
    console.log('cut', this.copiedElements);
  }

  duplicateSelectedElement(): void {
    this.duplicatedElements = [];
    for (const element of this.selection.selectedElements) {
      this.createCopyDrawElement(element, this.duplicatedElements);
    }
    this.selection.deleteBoundingBox();
    for (const element of this.duplicatedElements) {
      element.updatePosition(PASTE_OFFSET.x, PASTE_OFFSET.y);
      element.translateAllPoints();
      this.selection.selectedElements.push(element);
    }
    this.commands.execute(new AddSVGService(this.duplicatedElements, this.svgStockage));

    this.selection.createBoundingBox();
    console.log('duplicate', this.duplicatedElements);
  }

  deleteSelectedElement(): void {
    // TODO : CORRECTION UTILISATION COMMANDE REMOVE SVG
    this.removeCommand.addElements(this.selection.selectedElements);

    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
      this.selection.deleteBoundingBox();
    }
    console.log('delete');
  }

  pasteSelectedElement(): void {
    this.selection.deleteBoundingBox();
    const buffer: DrawElement[] = [];
    for (const element of this.copiedElements) {
      element.updatePosition(PASTE_OFFSET.x, PASTE_OFFSET.y);
      element.translateAllPoints();
    }

    if (this.isInDrawing) {
      for (const element of this.copiedElements) {
        this.selection.selectedElements.push(element);
        this.createCopyDrawElement(element, buffer);
      }
    } else {
      for (const element of this.copiedElements) {
        element.updatePosition(-PASTE_OFFSET.x * this.numberOfPaste, -PASTE_OFFSET.y * this.numberOfPaste);
        element.translateAllPoints();
        this.selection.selectedElements.push(element);
        this.createCopyDrawElement(element, buffer);
      }
    }

    this.commands.execute(new AddSVGService(this.copiedElements, this.svgStockage));

    this.copiedElements = buffer;

    this.selection.createBoundingBox();
    this.numberOfPaste++;
    console.log(this.numberOfPaste);
    console.log('paste', this.copiedElements);
  }

  isInDrawing(elements: DrawElement[]): boolean {
    let allElementAreVisible = true;
    for (const element of elements) {
      this.selection.findPointMinAndMax(element);
      const elementIsVisible = element.pointMin.x > this.drawing.width && element.pointMin.y > this.drawing.height;
      allElementAreVisible = allElementAreVisible && elementIsVisible;
    }
    return allElementAreVisible;
  }

  ongoingSelection(): boolean {
    return this.selection.selectionBox.box as unknown as boolean;
  }

  canPaste(): boolean {
    return this.copiedElements.length !== 0;
  }
}
