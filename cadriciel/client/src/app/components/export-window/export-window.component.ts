import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss']
})

export class ExportWindowComponent {
  private context: CanvasRenderingContext2D;
  private image: HTMLImageElement;

  constructor(private dialogRef: MatDialogRef<ExportWindowComponent>,
              private stockageSVG: SVGStockageService) { }

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
        const png = canvas.toDataURL('image/jpeg');
        const container = document.querySelector('#png-container');
        console.log(this.stockageSVG.getCompleteSVG());
        if (container) {
          container.innerHTML = '<img src="' + png + '" width="500" height="500"/>';
        }
        URL.revokeObjectURL(png);
    };
      this.image.src = URL.createObjectURL(svg);
    }
  }

}
