import { Component,ViewChild, ElementRef, AfterViewInit, Input,
Output, SimpleChanges, OnChanges, EventEmitter, HostListener, } from '@angular/core';

@Component({
  selector: 'app-couleur-palette',
  templateUrl: './couleur-palette.component.html',
  styleUrls: ['./couleur-palette.component.scss']
})
export class CouleurPaletteComponent implements AfterViewInit, OnChanges {

  @Input()
  hue: string

  @Output()
  color: EventEmitter<string> = new EventEmitter(true)

  @ViewChild('canvas' , {static: false} )
  canvas: ElementRef<HTMLCanvasElement>

  private ctx: CanvasRenderingContext2D

  private mousedown: boolean = false

  selectedPosition: { x: number; y: number}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hue']) {
      this.draw()
      const pos = this.selectedPosition
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y))
      }
    }
  }


  ngAfterViewInit() {
    this.draw()
  }

  draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d')
    }

    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)'
    this.ctx.fillRect(0, 0, width, height)

    const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0)
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)')
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)')

    this.ctx.fillStyle = whiteGrad
    this.ctx.fillRect(0, 0, width, height)

    const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height)
    blackGrad.addColorStop(0, 'rgba(255,255,255,1)')
    blackGrad.addColorStop(1, 'rgba(255,255,255,0)')

    this.ctx.fillStyle = blackGrad
    this.ctx.fillRect(0, 0, width, height)

    if (this.selectedPosition) {
      this.ctx.strokeStyle = 'white'
      this.ctx.fillStyle = 'white'
      this.ctx.beginPath()
      this.ctx.arc(
        this.selectedPosition.x,
        this.selectedPosition.y,
        10,
        0,
        2 * Math.PI
      )
      this.ctx.lineWidth = 5
      this.ctx.stroke()
    }


    @HostListener ('window:mouseup', ['$event'] )
    onmouseup(evt: MouseEvent) {
      this.mousedown = false
    }

    onmousedown( evt: MouseEvent) {
      this.mousedown = true
      this.selectedPosition ={x: EventTarget.offsetX, y: EventTarget.offsetY}
      this.draw()
      this.color.emit(this.getColorAtPosition (evt.offsetX, ect.OffsetY))
    }

    onMouseMove(evt: MouseEvent) {
      this.mousedown = true
      this.selectedPosition = { x: EventTarget.offsetX, y: EventTarget.offsetY}
      this.draw()
      this.emitColor(evt.offSetX, evt.offsetY)
    }

    emitColor(x: Number, y: Number) {
      const rgbaColor = this.getColorAtPosition(x,y)
      this.color.emit(rgbaColor)
    }

    getColorAtPosition(x: Number, y: Number) {
      const imageData =this.ctx.getImageData(x, y, 1, 1,).data
      return(
        'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)')
    }
  }
}
