/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef,  HostListener, Input, OnChanges,
         SimpleChanges, ViewChild, } from '@angular/core';
import { ColorManagerService } from 'src/app/services/couleur/color-manager.service';
import { ToolInterface } from 'src/app/services/outils/tool-interface';

@Component({
  selector: 'app-couleur-palette',
  templateUrl: './couleur-palette.component.html',
  styleUrls: ['./couleur-palette.component.scss']
})
export class CouleurPaletteComponent implements AfterViewInit, OnChanges, ToolInterface {

  @Input() gestionnaireCouleur: ColorManagerService;

  @ViewChild('canvas' , {static: false} )
  canvas: ElementRef<HTMLCanvasElement>;

  private context2D: CanvasRenderingContext2D;

  private sourisBas = false;

  hauteurChoisie: { x: number; y: number};

  ngOnChanges(changes: SimpleChanges) {
    if (changes[this.gestionnaireCouleur.hue]) {
      this.dessin();
      const pos = this.hauteurChoisie;
      if (pos) {
        this.couleurPosition(pos.x, pos.y);
      }
    }
  }

  couleurPosition(x: number, y: number) {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    this.gestionnaireCouleur.color = 'rgba(' + imageData[0] + ',' + imageData[1] + ','
      + imageData[2] + ',';
    this.gestionnaireCouleur.RGB = [imageData[0], imageData[1], imageData[2]];
  }

  couleurEmise(x: number, y: number) {
    this.couleurPosition(x, y);
  }

  @HostListener ('window:mouseup', ['$event'] )
    onMouseRelease(evt: MouseEvent) {
      this.sourisBas = false;
    }

    onMousePress( evt: MouseEvent) {
      this.sourisBas = true;
      this.hauteurChoisie = {x: evt.offsetX, y: evt.offsetY};
      this.dessin();
      this.couleurPosition(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent) {
      if (this.sourisBas) {
        this.hauteurChoisie = { x: evt.offsetX, y: evt.offsetY};
        this.dessin();
        this.couleurEmise(evt.offsetX, evt.offsetY);
      }
    }

  ngAfterViewInit() {
    this.dessin();
  }

  dessin() {

    this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const largeur = this.canvas.nativeElement.width;
    const hauteur = this.canvas.nativeElement.height;

    this.context2D.fillStyle = this.gestionnaireCouleur.hue + '1)';
    this.context2D.fillRect(0, 0, largeur, hauteur);

    const whiteGrad = this.context2D.createLinearGradient(0, 0, largeur, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.context2D.fillStyle = whiteGrad;
    this.context2D.fillRect(0, 0, largeur, hauteur);

    const blackGrad = this.context2D.createLinearGradient(0, 0, 0, hauteur);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.context2D.fillStyle = blackGrad;
    this.context2D.fillRect(0, 0, largeur, hauteur);

    if (this.hauteurChoisie) {
      this.context2D.strokeStyle = 'white';
      this.context2D.fillStyle = 'white';
      this.context2D.beginPath();
      this.context2D.arc(
        this.hauteurChoisie.x,
        this.hauteurChoisie.y,
        10,
        0,
        2 * Math.PI
      )
      this.context2D.lineWidth = 5;
      this.context2D.stroke();
    }
  }
}
