/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef,  HostListener, Input, OnChanges,
         SimpleChanges, ViewChild, } from '@angular/core';
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { InterfaceOutils } from 'src/app/services/outils/interface-outils';

@Component({
  selector: 'app-couleur-palette',
  templateUrl: './couleur-palette.component.html',
  styleUrls: ['./couleur-palette.component.scss']
})
export class CouleurPaletteComponent implements AfterViewInit, OnChanges, InterfaceOutils {

  @Input() gestionnaireCouleur: GestionnaireCouleursService;

  @ViewChild('canvas' , {static: false} )
  canvas: ElementRef<HTMLCanvasElement>;

  private context2D: CanvasRenderingContext2D;

  private sourisBas = false;

  hauteurChoisi: { x: number; y: number};

  ngOnChanges(changes: SimpleChanges) {
    if (changes[this.gestionnaireCouleur.teinte]) {
      this.draw();
      const pos = this.hauteurChoisi;
      if (pos) {
        this.couleurPosition(pos.x, pos.y);
      }
    }
  }

  couleurPosition(x: number, y: number) {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    this.gestionnaireCouleur.couleur = 'rgba(' + imageData[0] + ',' + imageData[1] + ','
      + imageData[2] + ',';
    this.gestionnaireCouleur.RGB = [imageData[0], imageData[1], imageData[2]];
  }

  couleurEmise(x: number, y: number) {
    this.couleurPosition(x, y);
  }

  @HostListener ('window:mouseup', ['$event'] )
    sourisRelachee(evt: MouseEvent) {
      this.sourisBas = false;
    }

    sourisEnfoncee( evt: MouseEvent) {
      this.sourisBas = true;
      this.hauteurChoisi = {x: evt.offsetX, y: evt.offsetY};
      this.draw();
      this.couleurPosition(evt.offsetX, evt.offsetY);
    }

    sourisDeplacee(evt: MouseEvent) {
      if (this.sourisBas) {
        this.hauteurChoisi = { x: evt.offsetX, y: evt.offsetY};
        this.draw();
        this.couleurEmise(evt.offsetX, evt.offsetY);
      }
    }

  ngAfterViewInit() {
    this.draw();
  }

  draw() {

    this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.context2D.fillStyle = this.gestionnaireCouleur.teinte + '1)' || 'rgba(255,255,255,1)';
    this.context2D.fillRect(0, 0, width, height);

    const whiteGrad = this.context2D.createLinearGradient(0, 0, width, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

    this.context2D.fillStyle = whiteGrad;
    this.context2D.fillRect(0, 0, width, height);

    const blackGrad = this.context2D.createLinearGradient(0, 0, 0, height);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

    this.context2D.fillStyle = blackGrad;
    this.context2D.fillRect(0, 0, width, height);

    if (this.hauteurChoisi) {
      this.context2D.strokeStyle = 'white';
      this.context2D.fillStyle = 'white';
      this.context2D.beginPath();
      this.context2D.arc(
        this.hauteurChoisi.x,
        this.hauteurChoisi.y,
        10,
        0,
        2 * Math.PI
      )
      this.context2D.lineWidth = 5;
      this.context2D.stroke();
    }
  }
}
