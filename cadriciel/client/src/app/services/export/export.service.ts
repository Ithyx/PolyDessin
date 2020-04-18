import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { CanvasConversionService } from '../canvas-conversion.service';
import { Color } from '../color/color';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { FILTERS } from '../filters/filters';
import { DatabaseService } from '../saving/remote/database.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';

const AUTHOR_OFFSET = 5;
const AUTHOR_OUTLINE_WIDTH = 3;
export const PREVIEW_SIZE = '200';

export enum MailStatus {
  UNDEFINED = 0,
  LOADING = 1,
  SUCCESS = 2,
  FAILURE = 3
}

export interface ExportParams {
  element: SVGElement;
  selectedExportFormat: string;
  container: HTMLAnchorElement;
  selectedAuthor: string;
  selectedFileName: string;
  emailAdress: string;
  isEmail: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  mailStatus: MailStatus;
  mostRecentError: number | undefined;
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  protected drawing: Drawing;
  private image: HTMLImageElement;
  private container: HTMLAnchorElement;
  private selectedExportFormat: string;
  private selectedFileName: string;
  private selectedAuthor: string;
  private emailAdress: string;

  constructor(private db: DatabaseService,
              private drawingParams: DrawingManagerService,
              private stockageSVG: SVGStockageService,
              private canvasConversion: CanvasConversionService) {
    this.drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: this.drawingParams.tags,
      elements: this.stockageSVG.getCompleteSVG()
    };
    this.canvas = this.canvasConversion.canvas;
    this.mailStatus = MailStatus.UNDEFINED;
    this.mostRecentError = undefined;
  }

  generateSVG(drawing: Drawing, width: number, height: number, backgroundColor: Color, authorName: string): string {
    let imageData =
    `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n`;
    imageData += '<defs>\n';
    for (const filter of FILTERS) {
      imageData += `${filter}\n`;
    }
    imageData += '</defs>\n';
    imageData += `<rect x="0" y="0" width="${width}" height="${height}"
    fill="${backgroundColor.RGBAString}"></rect>\n`;
    if (drawing.elements) {
      for (const element of drawing.elements) {
        imageData += `<g>${element.svg}</g>\n`;
      }
    }
    if (authorName !== '') {
      imageData += `<text x="0" y="${height - AUTHOR_OFFSET}" ` +
      `style="font-family:Arial;font-size:30;stroke:#ffffff;fill:#000000;">
      auteur: ${authorName}
      </text>\n`;
    }
    imageData += '</svg>\n';
    return imageData;
  }

  drawAuthorCanvas(context: CanvasRenderingContext2D, authorName: string, height: number): void {
    context.font = '30px Arial';
    context.strokeStyle = 'white';
    context.lineWidth = AUTHOR_OUTLINE_WIDTH;
    context.strokeText(`auteur: ${authorName}`, 0, height - AUTHOR_OFFSET);
    context.fillStyle = 'black';
    context.fillText(`auteur: ${authorName}`, 0, height - AUTHOR_OFFSET);
  }

  export(params: ExportParams): void {
    this.selectedExportFormat = params.selectedExportFormat;
    this.container = params.container;
    this.emailAdress = params.emailAdress;
    this.selectedFileName = params.selectedFileName;
    this.selectedAuthor = params.selectedAuthor;
    const context = this.canvas.getContext('2d');
    if (context) {
      params.element.setAttribute('width', this.drawingParams.width.toString());
      params.element.setAttribute('height', this.drawingParams.height.toString());

      this.context = context;
      const svgString = new XMLSerializer().serializeToString(params.element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = (params.isEmail) ? this.sendImage.bind(this) : this.downloadImage.bind(this);
      this.image.src = URL.createObjectURL(svg);

      params.element.setAttribute('width', PREVIEW_SIZE);
      params.element.setAttribute('height', PREVIEW_SIZE);
    }
  }

  downloadImage(): void {
    this.context.drawImage(this.image, 0, 0);
    let imageSrc = '';
    if (this.selectedExportFormat === 'svg') {
      imageSrc = this.image.src;
    } else {
      imageSrc = this.canvas.toDataURL('image/' + this.selectedExportFormat);
    }
    this.container.href = imageSrc;
    console.log(this.selectedFileName);
    this.container.download = this.selectedFileName;
    this.container.click();
    URL.revokeObjectURL(imageSrc);
  }

  sendImage(): void {
    this.mailStatus = MailStatus.LOADING;
    this.context.drawImage(this.image, 0, 0);
    if (this.selectedAuthor !== '' && this.context) {
      this.drawAuthorCanvas(this.context, this.selectedAuthor, this.drawingParams.height);
    }
    let imageData = this.canvas.toDataURL('image/' + this.selectedExportFormat);
    if (this.selectedExportFormat === 'svg') {
      imageData = this.generateSVG(this.drawing, this.drawingParams.width, this.drawingParams.height,
        this.drawingParams.backgroundColor, this.selectedAuthor);
    }
    this.db.sendEmail(this.emailAdress, imageData, this.selectedFileName, this.selectedExportFormat)
    .then(() => {
      this.mailStatus = MailStatus.SUCCESS;
    }, (err) => {
      this.mostRecentError = err.status;
      this.mailStatus = MailStatus.FAILURE;
    });
  }
}
