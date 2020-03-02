// Outil de pipette basé sur http://bl.ocks.org/biovisualize/8187844?fbclid=IwAR3_VuqkefCECFbFJ_0nQJuYe0qIx9NFzE0uY9W0UDytZDsPsEpB4QvnTYk

import { ElementRef, Injectable } from '@angular/core';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PipetteToolService implements ToolInterface {

  constructor(public drawingManager: DrawingManagerService,
              public stockageSVG: SVGStockageService) { }

  onMouseClick(mouse: MouseEvent): void {
    const element = document.querySelector('.drawing');
    if (element) {
      const svgString = new XMLSerializer().serializeToString(element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const canvas = document.getElementById('canvas');
      if (canvas) {
        const context = (canvas as HTMLCanvasElement).getContext('2d');
        if (context) {
          const img = new Image();
          const url = URL.createObjectURL(svg);
          img.onload = () => {
            if (context) {
              context.drawImage(img, 0, 0);
            }
          };
          img.src = url;
          const imageData = context.getImageData(mouse.offsetX, mouse.offsetY, 1, 1).data;
          console.log('rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ')');
        }
      }
    }
  }
}
