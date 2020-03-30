import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Drawing } from '../../../../common/communication/DrawingInterface';
import { DrawingManagerService } from './drawing-manager/drawing-manager.service';
import { B, Color, DrawElement, G, R } from './stockage-svg/draw-element';
import { LineService } from './stockage-svg/line.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { TraceBrushService } from './stockage-svg/trace-brush.service';
import { TracePencilService } from './stockage-svg/trace-pencil.service';
import { TraceSprayService } from './stockage-svg/trace-spray.service';

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

  constructor(private drawingParams: DrawingManagerService,
              private svgStockage: SVGStockageService,
              private sanitizer: DomSanitizer) {
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
    this.isValid = false;
    this.drawing.elements = [];
    this.coloredElements = new Map<string, DrawElement>();
    const rgb: number[] = [0, 0, 0];
    for (let element of this.svgStockage.getCompleteSVG()) {
      let increase = 1;
      if (element instanceof TraceSprayService) {
        increase = COLOR_INCREASE_SPRAY;
      } else if (element instanceof LineService) {
        increase = COLOR_INCREASE_LINE;
      }
      element = element as DrawElement;
      rgb[R] += increase;
      if (rgb[R] > MAX_COLOR_VALUE) {
        rgb[R] = 0;
        rgb[G] += increase;
        if (rgb[G] > MAX_COLOR_VALUE) {
          rgb[G] = 0;
          rgb[B] += increase;
        }
      }
      // Redessiner l'élement avec une couleur qui le distingue des autres élements
      const color: Color = {
        RGBAString: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
        RGBA: [rgb[0], rgb[1], rgb[2], 1]
      };
      const oldPrimary = element.primaryColor;
      const oldSecondary = element.secondaryColor;
      element.primaryColor = color;
      if (element.secondaryColor) {
        element.secondaryColor = color;
      }

      // Créer un clone et l'utiliser dans le canvas
      const cloneElement = {...element};
      if (element instanceof TraceBrushService) {
        // Si l'élément est un trait de pinceau, on le convertit en trait de crayon
        // pour éviter d'avoir un filtre qui modifie les couleurs
        const tracePencil = new TracePencilService();
        tracePencil.points = element.points;
        tracePencil.primaryColor = element.primaryColor;
        tracePencil.thickness = element.thickness;
        tracePencil.translate = element.translate;
        tracePencil.isAPoint = element.isAPoint;
        tracePencil.draw();
        cloneElement.svgHtml = this.sanitize(tracePencil.svg);
      } else {
        element.draw();
        cloneElement.svgHtml = this.sanitize(element.svg);
        if (element.secondaryColor) {
          element.secondaryColor = oldSecondary;
        }
      }
      this.drawing.elements.push(cloneElement);

      // Remettre l'élement aux bonnes valeurs de couleur
      element.primaryColor = oldPrimary;
      element.draw();
      this.coloredElements.set(color.RGBAString, element);
    }
    const timeout = window.setTimeout(() => {
      this.convertToCanvas();
      window.clearTimeout(timeout);
    }, TIME_BEFORE_UPDATE);
  }

  getElementsInArea(x: number, y: number, width: number, height: number): DrawElement[] {
    if (!this.isValid) { return []; }
    const occurrences = new Map<string, number>();
    const elements: DrawElement[] = [];
    const data = this.context.getImageData(x, y, width, height).data;
    for (let index = 0; index < data.length; index += INDEX_INCREASE) {
      const color = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`;
      if (this.coloredElements.has(color)) {
        const colorOccurrences = occurrences.get(color);
        occurrences.set(color, (colorOccurrences ? colorOccurrences + 1 : 1));
      }
    }
    occurrences.forEach((value, color) => {
      // s'assurer de ne pas prendre en compte le 'blending' entre plusieurs éléments
      if (!this.canBeBlending(occurrences, value, width)) {
        const element = this.coloredElements.get(color);
        if (element && !elements.includes(element)) {
          elements.push(element);
        }
      }
    });
    return elements;
  }

  canBeBlending(occurrences: Map<string, number>, value: number, thickness: number): boolean {
    const isOnlyElement = occurrences.size === 1;
    const hasFewOccurrences = value <= thickness;
    return !isOnlyElement && hasFewOccurrences;
  }

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
