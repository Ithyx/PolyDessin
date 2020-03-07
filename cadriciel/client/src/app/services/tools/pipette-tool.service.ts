import { Injectable } from '@angular/core';
import { Scope } from '../color/color-manager.service';
import { ColorParameterService } from '../color/color-parameter.service';
import { Point } from './line-tool.service';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PipetteToolService implements ToolInterface {

  image: HTMLImageElement;
  context: CanvasRenderingContext2D;
  mousePosition: Point;
  colorScope: Scope;

  constructor(public colorParameter: ColorParameterService,
               ) {}

  onMouseClick(mouse: MouseEvent): void {
    this.colorScope = Scope.Primary;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.createCanvas();
  }

  onRightClick(mouse: MouseEvent): void {
    this.colorScope = Scope.Secondary;
    this.mousePosition = {x: mouse.offsetX, y: mouse.offsetY};
    this.createCanvas();
  }

  /* Conversion de svg vers canvas basée sur
     http://bl.ocks.org/biovisualize/8187844?fbclid=IwAR3_VuqkefCECFbFJ_0nQJuYe0qIx9NFzE0uY9W0UDytZDsPsEpB4QvnTYk */
  createCanvas(): void {
    const element = document.querySelector('.drawing');
    const context = (document.querySelector('.canvas') as HTMLCanvasElement).getContext('2d');
    if (element && context) {
      this.context = context;
      const svgString = new XMLSerializer().serializeToString(element);
      const svg = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
      this.image = new Image();
      this.image.onload = this.pickColor.bind(this);
      this.image.src = URL.createObjectURL(svg);
    }
  }

  pickColor(): void {
    this.context.drawImage(this.image, 0, 0);
    const color = this.context.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data;
    switch (this.colorScope) {
      case Scope.Primary:
        this.colorParameter.primaryColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, `;
        break;
      case Scope.Secondary:
        this.colorParameter.secondaryColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, `;
        break;
    }
  }
}
