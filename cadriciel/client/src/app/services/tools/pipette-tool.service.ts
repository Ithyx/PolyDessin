import { Injectable } from '@angular/core';
import { Scope } from '../color/color-manager.service';
import { ColorParameterService } from '../color/color-parameter.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PipetteToolService implements ToolInterface {

  constructor(public colorParameter: ColorParameterService) { }

  onMouseClick(mouse: MouseEvent): void {
    this.pickColor(mouse, Scope.Primary);
  }

  onRightClick(mouse: MouseEvent): void {
    this.pickColor(mouse, Scope.Secondary);
  }

  /* Conversion de svg vers canvas basée sur
     http://bl.ocks.org/biovisualize/8187844?fbclid=IwAR3_VuqkefCECFbFJ_0nQJuYe0qIx9NFzE0uY9W0UDytZDsPsEpB4QvnTYk */
  pickColor(mouse: MouseEvent, colorScope: Scope): void {
    const element = document.querySelector('.drawing');
    const context = (document.querySelector('.canvas') as HTMLCanvasElement).getContext('2d');
    if (element && context) {
      const svgString = new XMLSerializer().serializeToString(element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0);
        const color = context.getImageData(mouse.offsetX, mouse.offsetY, 1, 1).data;
        switch (colorScope) {
          case Scope.Primary:
            this.colorParameter.primaryColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, `;
            break;
          case Scope.Secondary:
            this.colorParameter.secondaryColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, `;
            break;
        }
      };
      image.src = URL.createObjectURL(svg);
    }
  }
}
