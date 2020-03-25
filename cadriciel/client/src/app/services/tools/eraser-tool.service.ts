import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CanvasConversionService, MAX_COLOR_VALUE } from '../canvas-conversion.service';
import { CommandManagerService } from '../command/command-manager.service';
import { RemoveSVGService } from '../command/remove-svg.service';
import { B, DrawElement, G, R } from '../stockage-svg/draw-element';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';
import { ToolManagerService } from './tool-manager.service';

const DEFAULT_THICKNESS = 10;
const DARK_RED = 170;
const MIN_RED_EVIDENCE = 230;
const MAX_BLUE_EVIDENCE = 200;
const MAX_GREEN_EVIDENCE = 200;

@Injectable({
  providedIn: 'root'
})
export class EraserToolService implements ToolInterface {
  private selectedDrawElement: DrawElement[];
  private thickness: number;
  private removeCommand: RemoveSVGService;
  private initialPoint: Point;
  drawing: SVGElement;

  constructor(private tools: ToolManagerService,
              private sanitizer: DomSanitizer,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService,
              private canvas: CanvasConversionService) {
    this.selectedDrawElement = [];
    this.thickness = DEFAULT_THICKNESS;
    this.removeCommand = new RemoveSVGService(svgStockage);
  }

  makeSquare(mouse: MouseEvent): void {
    this.initialPoint = {x: mouse.offsetX - this.thickness / 2, y: mouse.offsetY - this.thickness / 2};
    const eraser = new RectangleService();
    eraser.svg = '<rect class="eraser" x="' + this.initialPoint.x + '" y="' + this.initialPoint.y +
    '" width="' + this.thickness + '" height="' + this.thickness +
    '" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"></rect>';
    eraser.svgHtml = this.sanitizer.bypassSecurityTrustHtml(eraser.svg);
    this.svgStockage.setOngoingSVG(eraser);
  }

  isInEraser(): void {
    this.findDrawElements();

    if (this.commands.drawingInProgress) {
      this.removeElements();
    } else {
      this.selectedDrawElement = [];
    }
  }

  findDrawElements(): void {
    const elementsInArea = this.canvas.getElementsInArea(this.initialPoint.x, this.initialPoint.y, this.thickness, this.thickness);
    for (const element of this.svgStockage.getCompleteSVG()) {
      element.erasingEvidence = false;
      if (elementsInArea.includes(element)) {
        this.selectedDrawElement.push(element);
        element.erasingEvidence = true;     // Mise en évidence (rouge)
        this.adaptRedEvidence(element);
      }
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
  }

  onMouseMove(mouse: MouseEvent): void {
    this.thickness = (this.tools.activeTool.parameters[0].value) ? this.tools.activeTool.parameters[0].value : DEFAULT_THICKNESS;
    this.makeSquare(mouse);
    this.isInEraser();
  }

  onMousePress(): void {
    this.removeCommand = new RemoveSVGService(this.svgStockage);
    this.commands.drawingInProgress = true;
  }

  onMouseClick(mouse: MouseEvent): void {
    this.removeCommand = new RemoveSVGService(this.svgStockage);
    this.commands.drawingInProgress = true;
    this.thickness = (this.tools.activeTool.parameters[0].value) ? this.tools.activeTool.parameters[0].value : DEFAULT_THICKNESS;
    this.makeSquare(mouse);
    this.isInEraser();
    this.commands.drawingInProgress = false;
    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
    }
    this.removeCommand = new RemoveSVGService(this.svgStockage);
  }

  onMouseRelease(): void {
    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
    }
    this.removeCommand = new RemoveSVGService(this.svgStockage);
    this.commands.drawingInProgress = false;
  }

  onMouseLeave(): void {
    this.clear();
  }

  removeElements(): void {
    for (const element of this.selectedDrawElement) {
      element.erasingEvidence = false;
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
    if (this.selectedDrawElement.length !== 0) {
      this.removeCommand.addElements(this.selectedDrawElement);
      this.canvas.updateDrawing();
    }
    this.selectedDrawElement = [];
  }

  clear(): void {
    for (const element of this.svgStockage.getCompleteSVG()) {
      element.erasingEvidence = false;
      element.draw();
      element.svgHtml = this.sanitizer.bypassSecurityTrustHtml(element.svg);
    }
    this.commands.drawingInProgress = false;
    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
    }
    this.removeCommand = new RemoveSVGService(this.svgStockage);
    this.svgStockage.setOngoingSVG(new RectangleService());
    this.selectedDrawElement = [];
  }

  adaptRedEvidence(element: DrawElement): void {
    if (element.secondaryColor && element.secondaryColor.RGBA[R] >= MIN_RED_EVIDENCE
        && element.secondaryColor.RGBA[G] <= MAX_GREEN_EVIDENCE && element.secondaryColor.RGBA[B] <= MAX_BLUE_EVIDENCE) {
      element.erasingColor.RGBA[R] = DARK_RED;
      element.erasingColor.RGBA[G] = 0;
      element.erasingColor.RGBA[B] = 0;
      this.updateErasingColor(element);
    } else if (!element.secondaryColor && element.primaryColor && element.primaryColor.RGBA[R] >= MIN_RED_EVIDENCE
        && element.primaryColor.RGBA[G] <= MAX_GREEN_EVIDENCE && element.primaryColor.RGBA[B] <= MAX_BLUE_EVIDENCE) {
      element.erasingColor.RGBA[R] = DARK_RED;
      element.erasingColor.RGBA[G] = 0;
      element.erasingColor.RGBA[B] = 0;
      this.updateErasingColor(element);
    } else {
      element.erasingColor.RGBA = [MAX_COLOR_VALUE, 0, 0, 1];
      this.updateErasingColor(element);
    }
  }

  updateErasingColor(element: DrawElement): void {
    element.erasingColor.RGBAString = 'rgba(' + element.erasingColor.RGBA[R] + ', ' + element.erasingColor.RGBA[G]
                                      + ', ' + element.erasingColor.RGBA[B] + ', 1)';
  }
}
