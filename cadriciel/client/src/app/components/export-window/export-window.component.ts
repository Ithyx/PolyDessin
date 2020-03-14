import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { Drawing } from '../../../../../common/communication/DrawingInterface';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss']
})

export class ExportWindowComponent {

  EXPORT_FORMAT: string[] = ['png', 'jpeg', 'svg'];
  EXPORT_FILTER: string[] = ['', 'Noir-et-blanc', 'Sepia', 'Flou', 'Tremblant', 'Tache'];

  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private selectedExportFormat: string;
  private selectedExportFilter: string;
  private selectedFileName: string;
  private canvas: HTMLCanvasElement;
  protected drawing: Drawing;

  constructor(private dialogRef: MatDialogRef<ExportWindowComponent>,
              private stockageSVG: SVGStockageService,
              private drawingParams: DrawingManagerService,
              private sanitizer: DomSanitizer
              ) {
    this.selectedExportFormat = this.EXPORT_FORMAT[0];
    this.selectedExportFilter = this.EXPORT_FILTER[0];
    this.selectedFileName = this.drawingParams.name;
    this.drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: this.drawingParams.tags,
      elements: this.stockageSVG.getCompleteSVG()
    };
  }

  close(): void {
    this.dialogRef.close();
  }

  export(): void {
    const element = document.querySelector('.drawing-preview');
    this.canvas = (document.querySelector('.canvas') as HTMLCanvasElement);
    const context = this.canvas.getContext('2d');
    if (element && context) {
      element.setAttribute('width', this.drawingParams.width.toString());
      element.setAttribute('height', this.drawingParams.height.toString());

      this.context = context;
      const svgString = new XMLSerializer().serializeToString(element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = this.downloadImage.bind(this);
      this.image.src = URL.createObjectURL(svg);

      element.setAttribute('width', '200');
      element.setAttribute('height', '200');
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
    const container = document.createElement('a');
    container.href = imageSrc;
    container.download = this.selectedFileName;
    container.click();
    URL.revokeObjectURL(imageSrc);
  }

  updateSelectedFormat(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFormat = eventCast.value;
    console.log('format: ', this.selectedExportFormat);
  }

  updateSelectedFilter(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFilter = eventCast.value;
    console.log('filter: ', this.selectedExportFilter);
  }

  updateFileName(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedFileName = eventCast.value;
    console.log('file name: ', this.selectedFileName);
  }

  sanatize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getFilter(): string {
    return this.selectedExportFilter ? ('url(#' + this.selectedExportFilter + ')') : 'none';
  }
}