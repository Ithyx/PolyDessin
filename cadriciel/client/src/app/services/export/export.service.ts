import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { Color } from '../color/color';
import { FILTERS } from '../filters/filters';

const AUTHOR_OFFSET = 5;
const AUTHOR_OUTLINE_WIDTH = 3;

@Injectable({
  providedIn: 'root'
})
export class ExportService {

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
      imageData += `<text x="0" y="${height - AUTHOR_OFFSET}"` +
      `style="font-family: Arial;font-size:30;stroke:#ffffff;fill:#000000;">
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
}
