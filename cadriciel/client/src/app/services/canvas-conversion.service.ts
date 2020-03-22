import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Drawing } from '../../../../common/communication/DrawingInterface';
import { DrawingManagerService } from './drawing-manager/drawing-manager.service';
import { Color, DrawElement } from './stockage-svg/draw-element';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { TraceBrushService } from './stockage-svg/trace-brush.service';
import { TracePencilService } from './stockage-svg/trace-pencil.service';

const MAX_COLOR_VALUE = 255;
const INDEX_INCREASE = 4;
const TIME_BEFORE_UPDATE = 20;

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
  }

  updateDrawing(): void {
    this.drawing.elements = [];
    this.coloredElements = new Map<string, DrawElement>();
    const rgb: number[] = [0, 0, 0];
    for (const element of this.svgStockage.getCompleteSVG()) {
      rgb[0]++;
      if (rgb[1] > 0 || rgb[0] > MAX_COLOR_VALUE) {
        rgb[0] = 0;
        rgb[1]++;
        if (rgb[2] > 0 || rgb[1] > MAX_COLOR_VALUE) {
          rgb[1] = 0;
          rgb[2]++;
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
      element.secondaryColor = color;

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
        tracePencil.draw();
        cloneElement.svgHtml = this.sanatize(tracePencil.svg);
      } else {
        element.draw();
        cloneElement.svgHtml = this.sanatize(element.svg);
        element.secondaryColor = oldSecondary;
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
    const elements: DrawElement[] = [];
    const data = this.context.getImageData(x, y, width, height).data;
    for (let index = 0; index < data.length; index += INDEX_INCREASE) {
      const color = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`;
      const element = this.coloredElements.get(color);
      if (element && !elements.includes(element)) {
        elements.push(element);
      }
    }
    return elements;
  }

  sanatize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
