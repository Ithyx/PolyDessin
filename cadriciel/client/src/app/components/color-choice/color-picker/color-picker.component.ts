/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef,  HostListener, Input, OnChanges,
         SimpleChanges, ViewChild, } from '@angular/core';
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { A } from 'src/app/services/stockage-svg/draw-element';

const HUE_OPACITY = '1)';

const WHITE_GRAD_POSITION_0 = 'rgba(255,255,255,1)';
const WHITE_GRAD_POSITION_1 = 'rgba(255,255,255,0)';

const BLACK_GRAD_POSITION_0 = 'rgba(0,0,0,0)';
const BLACK_GRAD_POSITION_1 = 'rgba(0,0,0,1)';

const CONTEXT_2D_STROKE_STYLE = 'white';
const CONTEXT_2D_FILL_STYLE = 'white';
const CONTEXT_2D_ARC_RADIUS = 10;
const CONTEXT_2D_ARC_START_ANGLE = 0;
const CONTEXT_2D_ARC_END_ANGLE = 2 * Math.PI;
const CONTEXT_2D_LINE_WIDTH = 5;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent implements AfterViewInit, OnChanges, ToolInterface {

  @Input() colorManager: ColorManagerService;

  @ViewChild('canvas' , {static: false} )
  canvas: ElementRef<HTMLCanvasElement>;

  private context2D: CanvasRenderingContext2D;
  private mouseDown: boolean;
  chosenHeight: { x: number; y: number};

  constructor() {
    this.mouseDown = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[this.colorManager.hue]) {
      this.draw();
      const pos = this.chosenHeight;
      if (pos) {
        this.colorPosition(pos.x, pos.y);
      }
    }
  }

  colorPosition(x: number, y: number): void {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    this.colorManager.color.RGBA = [imageData[0], imageData[1], imageData[2], this.colorManager.color.RGBA[A]];
    this.colorManager.updateColor();
  }

  emittedColor(x: number, y: number): void {
    this.colorPosition(x, y);
  }

  @HostListener ('window:mouseup', ['$event'] )
    onMouseRelease(evt: MouseEvent): void {
      this.mouseDown = false;
    }

    onMousePress(evt: MouseEvent): void {
      this.mouseDown = true;
      this.chosenHeight = {x: evt.offsetX, y: evt.offsetY};
      this.draw();
      this.colorPosition(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
      if (this.mouseDown) {
        this.chosenHeight = { x: evt.offsetX, y: evt.offsetY};
        this.draw();
        this.emittedColor(evt.offsetX, evt.offsetY);
      }
    }

  ngAfterViewInit(): void {
    this.draw();
  }

  draw(): void {

    this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.context2D.fillStyle = this.colorManager.hue + HUE_OPACITY;
    this.context2D.fillRect(0, 0, width, height);

    const whiteGrad = this.context2D.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, WHITE_GRAD_POSITION_0);
    whiteGrad.addColorStop(1, WHITE_GRAD_POSITION_1);

    this.context2D.fillStyle = whiteGrad;
    this.context2D.fillRect(0, 0, width, height);

    const blackGrad = this.context2D.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, BLACK_GRAD_POSITION_0);
    blackGrad.addColorStop(1, BLACK_GRAD_POSITION_1);

    this.context2D.fillStyle = blackGrad;
    this.context2D.fillRect(0, 0, width, height);

    if (this.chosenHeight) {
      this.context2D.strokeStyle = CONTEXT_2D_STROKE_STYLE;
      this.context2D.fillStyle = CONTEXT_2D_FILL_STYLE;
      this.context2D.beginPath();
      this.context2D.arc(
        this.chosenHeight.x,
        this.chosenHeight.y,
        CONTEXT_2D_ARC_RADIUS,
        CONTEXT_2D_ARC_START_ANGLE,
        CONTEXT_2D_ARC_END_ANGLE
      );
      this.context2D.lineWidth = CONTEXT_2D_LINE_WIDTH;
      this.context2D.stroke();
    }
  }
}
