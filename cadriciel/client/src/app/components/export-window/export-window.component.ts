import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss']
})

export class ExportWindowComponent {

  EXPORT_FORMAT: string[] = ['png', 'jpeg', 'svg'];
  EXPORT_FILTER: string[] = ['', 'filter1', 'filter2', 'filter3', 'filter4', 'filter5'];

  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;
  private selectedExportFormat: string;
  private selectedExportFilter: string;
  private selectedFileName: string;

  constructor(private dialogRef: MatDialogRef<ExportWindowComponent>,
              private stockageSVG: SVGStockageService
              ) {
                this.selectedExportFormat = this.EXPORT_FORMAT[0];
                this.selectedExportFilter = this.EXPORT_FILTER[0];
                this.selectedFileName = 'image';
              }

  close(): void {
    this.dialogRef.close();
  }

  export(): void {
    const element = document.querySelector('.drawing');
    const canvas = (document.querySelector('.canvas') as HTMLCanvasElement);
    const context = canvas.getContext('2d');
    if (element && context) {
      this.context = context;
      const svgString = new XMLSerializer().serializeToString(element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = () => {
        this.context.drawImage(this.image, 0, 0);
        let imageType = '';
        if (this.selectedExportFormat === 'png' || 'jpeg') {
          imageType = 'image/' + this.selectedExportFormat;
        } else if (this.selectedExportFormat === 'svg') {
          // TODO : gérer le cas 'svg'
        }
        const imageSrc = canvas.toDataURL(imageType);
        const container = document.querySelector('#image-container');
        console.log(this.stockageSVG.getCompleteSVG());
        if (container) {
          container.innerHTML = '<a href="' + imageSrc + '" download="' + this.selectedFileName + '">'
            + '<img src="' + imageSrc + '" width="500" height="500"/></a>';
        }
        URL.revokeObjectURL(imageSrc);
      };
      this.image.src = URL.createObjectURL(svg);
    }
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
}
