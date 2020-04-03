import { Injectable } from '@angular/core';
import { A, B, G, R } from '../color/color';
import { Scope } from '../color/color-manager.service';
import { ColorParameterService } from '../color/color-parameter.service';
import { Point } from '../stockage-svg/draw-element/draw-element';
import { ToolInterface } from './tool-interface';

@Injectable({
  providedIn: 'root'
})
export class PipetteToolService implements ToolInterface {

  private image: HTMLImageElement;
  private context: CanvasRenderingContext2D;
  private mousePosition: Point;
  private colorScope: Scope;
  drawing: SVGElement;
  canvas: HTMLCanvasElement;

  constructor(private colorParameter: ColorParameterService,
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
    const context = this.canvas.getContext('2d');
    if (this.drawing && context) {
      this.context = context;
      const svgString = new XMLSerializer().serializeToString(this.drawing);
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
        this.colorParameter.primaryColor.RGBA = [color[R], color[G], color[B], this.colorParameter.primaryColor.RGBA[A]];
        this.colorParameter.updateColors();
        break;
      case Scope.Secondary:
        this.colorParameter.secondaryColor.RGBA = [color[R], color[G], color[B], this.colorParameter.secondaryColor.RGBA[A]];
        this.colorParameter.updateColors();
        break;
    }
  }
}
