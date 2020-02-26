/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef, HostListener, Input,
         ViewChild } from '@angular/core'
import { ColorManagerService } from 'src/app/services/color/color-manager.service';
import { ToolInterface } from 'src/app/services/outils/tool-interface';

@Component({
  selector: 'app-glissiere-couleur',
  templateUrl: './glissiere-couleur.component.html',
  styleUrls: ['./glissiere-couleur.component.scss']
})

export class GlissiereCouleurComponent implements AfterViewInit, ToolInterface {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>
  @Input() gestionnaireCouleur: ColorManagerService;

  private context2D: CanvasRenderingContext2D ;
  private sourisbas =  false
  hauteurChoisi: number;

  ngAfterViewInit() {
    this.dessin();
  }

  dessin() {

    if (!this.context2D) {
      this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }
    const largeur = this.canvas.nativeElement.width;
    const hauteur = this.canvas.nativeElement.height;

    this.context2D.clearRect(0, 0, largeur, hauteur);

    const gradient = this.context2D.createLinearGradient(0, 0, 0, hauteur);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.context2D.beginPath();
    this.context2D.rect(0, 0, largeur, hauteur);

    this.context2D.fillStyle = gradient;
    this.context2D.fill();
    this.context2D.closePath();

    if (this.hauteurChoisi) {
      this.context2D.beginPath();
      this.context2D.strokeStyle = 'white';
      this.context2D.lineWidth = 5;
      this.context2D.rect(0, this.hauteurChoisi - 5, largeur, 10);
      this.context2D.stroke();
      this.context2D.closePath();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseRelease() {
    this.sourisbas = false;
  }

  onMousePress(evt: MouseEvent) {
    this.sourisbas = true;
    this.hauteurChoisi = evt.offsetY;
    this.dessin();
    this.couleurEmise(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.sourisbas) {
      this.hauteurChoisi = evt.offsetY;
      this.dessin();
      this.couleurEmise(evt.offsetX, evt.offsetY);
    }
  }

  couleurEmise(x: number, y: number) {
    this.couleurPosition(x, y);
  }

  couleurPosition(x: number, y: number) {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    const rgbaCouleur = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' +
      imageData[2] + ',';

    this.gestionnaireCouleur.color = rgbaCouleur;
    this.gestionnaireCouleur.hue = rgbaCouleur;
    this.gestionnaireCouleur.RGB = [imageData[0], imageData[1], imageData[2]];
  }

}
