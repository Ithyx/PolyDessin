import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { B, Color, G, R } from '../color/color';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { SavingUtilityService } from '../saving/saving-utility.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { TraceBrushService } from '../stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TOOL_INDEX } from '../tools/tool-manager.service';

export const MAX_COLOR_VALUE = 255;
export const COLOR_INCREASE_LINE = 2;
export const COLOR_INCREASE_SPRAY = 5;
const INDEX_INCREASE = 4;
const TIME_BEFORE_UPDATE = 1;

@Injectable({
  providedIn: 'root'
})
export class CanvasConversionService {
  canvas: HTMLCanvasElement;
  coloredDrawing: SVGElement;
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private drawing: Drawing;
  private coloredElements: Map<string, DrawElement>;
  private isValid: boolean;
  private elementRGB: [number, number, number];

  constructor(private drawingParams: DrawingManagerService,
              private svgStockage: SVGStockageService,
              private sanitizer: DomSanitizer,
              private savingUtility: SavingUtilityService) {
    this.drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: {
        RGBAString: 'rgba(255, 255, 255, 1)',
        RGBA: [MAX_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE, 1]
      },
      tags: this.drawingParams.tags,
      elements: []
    };
    this.coloredElements = new Map<string, DrawElement>();
    this.elementRGB = [0, 0, 0];
    this.isValid = false;
  }

  /* Conversion de svg vers canvas basée sur
     http://bl.ocks.org/biovisualize/8187844?fbclid=IwAR3_VuqkefCECFbFJ_0nQJuYe0qIx9NFzE0uY9W0UDytZDsPsEpB4QvnTYk */
  convertToCanvas(): void {
    if (!this.canvas) { return; }
    const context = this.canvas.getContext('2d');
    if (this.coloredDrawing && context) {
      this.context = context;
      const svgString = new XMLSerializer().serializeToString(this.coloredDrawing);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = this.loadImage.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  loadImage(): void {
    this.context.drawImage(this.image, 0, 0);
    this.isValid = true;
  }

  updateDrawing(): void {
    this.coloredDrawing.setAttribute('width', this.drawingParams.width.toString());
    this.coloredDrawing.setAttribute('height', this.drawingParams.height.toString());
    this.canvas.setAttribute('width', this.drawingParams.width.toString());
    this.canvas.setAttribute('height', this.drawingParams.height.toString());

    this.isValid = false;
    this.drawing.elements = [];
    this.coloredElements = new Map<string, DrawElement>();
    this.elementRGB = [0, 0, 0];
    for (const element of this.svgStockage.getCompleteSVG()) {
      // Redessiner l'élement avec une couleur qui le distingue des autres élements
      const color = this.calculateColor(element);
      const oldPrimary = element.primaryColor;
      const oldSecondary = element.secondaryColor;
      element.primaryColor = color;
      if (element.secondaryColor) {
        element.secondaryColor = color;
      }

      // Créer un clone et l'utiliser dans le canvas
      const cloneElement = this.createClone(element);
      this.drawing.elements.push(cloneElement);

      // Remettre l'élement aux bonnes valeurs de couleur
      element.primaryColor = oldPrimary;
      if (element.secondaryColor) {
        element.secondaryColor = oldSecondary;
      }
      element.draw();
      this.coloredElements.set(color.RGBAString, element);
    }
    const timeout = window.setTimeout(() => {
      this.convertToCanvas();
      window.clearTimeout(timeout);
    }, TIME_BEFORE_UPDATE);
  }

  calculateColor(element: DrawElement): Color {
    let increase = 1;
    if (element.trueType === TOOL_INDEX.SPRAY) {
      increase = COLOR_INCREASE_SPRAY;
    } else if (element.trueType === TOOL_INDEX.LINE) {
      increase = COLOR_INCREASE_LINE;
    }
    this.elementRGB[R] += increase;
    if (this.elementRGB[R] > MAX_COLOR_VALUE) {
      this.elementRGB[R] = 0;
      this.elementRGB[G] += increase;
      if (this.elementRGB[G] > MAX_COLOR_VALUE) {
        this.elementRGB[G] = 0;
        this.elementRGB[B] += increase;
      }
    }
    return {
      RGBAString: `rgba(${this.elementRGB[R]}, ${this.elementRGB[G]}, ${this.elementRGB[B]}, 1)`,
      RGBA: [this.elementRGB[R], this.elementRGB[G], this.elementRGB[B], 1]
    };
  }

  createClone(element: DrawElement): DrawElement {
    const cloneElement = this.savingUtility.createCopyDrawElement(element);
    if (element instanceof TraceBrushService) {
      // Si l'élément est un trait de pinceau, on le convertit en trait de crayon
      // pour éviter d'avoir un filtre qui modifie les couleurs
      const tracePencil = new TracePencilService();
      tracePencil.points = element.points;
      tracePencil.primaryColor = element.primaryColor;
      tracePencil.thickness = element.thickness;
      tracePencil.transform = element.transform;
      tracePencil.isAPoint = element.isAPoint;
      tracePencil.draw();
      cloneElement.svgHtml = this.sanitize(tracePencil.svg);
    } else {
      element.draw();
      cloneElement.svgHtml = this.sanitize(element.svg);
    }
    return cloneElement;
  }

  getElementsInArea(x: number, y: number, width: number, height: number): DrawElement[] {
    if (!this.isValid) { return []; }
    const occurrences = this.getColorOccurrences(x, y, width, height);
    const elements: DrawElement[] = [];
    occurrences.forEach((value, color) => {
      // s'assurer de ne pas prendre en compte le 'blending' entre plusieurs éléments
      if (!this.canBeBlending(occurrences, value, width)
        || this.isPointInArea(this.coloredElements.get(color), x, y, width, height)) {
        const element = this.coloredElements.get(color);
        if (element && !elements.includes(element)) {
          elements.push(element);
        }
      }
    });
    return elements;
  }

  getColorOccurrences(x: number, y: number, width: number, height: number): Map<string, number> {
    const occurrences = new Map<string, number>();
    const data = this.context.getImageData(x, y, width, height).data;
    for (let index = 0; index < data.length; index += INDEX_INCREASE) {
      const color = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`;
      if (this.coloredElements.has(color)) {
        const colorOccurrences = occurrences.get(color);
        occurrences.set(color, (colorOccurrences ? colorOccurrences + 1 : 1));
      }
    }
    return occurrences;
  }

  canBeBlending(occurrences: Map<string, number>, value: number, thickness: number): boolean {
    const isOnlyElement = occurrences.size === 1;
    const hasFewOccurrences = value <= thickness;
    return !isOnlyElement && hasFewOccurrences;
  }

  // Cas spécifique aux points de crayon et pinceau (souvent faussement considérés comme blending)
  isPointInArea(element: DrawElement | undefined, x: number, y: number, width: number, height: number): boolean {
    if (element && element.isAPoint && element.thickness) {
      const isInEraserX = element.points[0].x + element.thickness >= x && element.points[0].x - element.thickness <= x + width;
      const isInEraserY = element.points[0].y + element.thickness >= y && element.points[0].y - element.thickness <= y + height;
      return isInEraserX && isInEraserY;
    }
    return false;
  }

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
