/*Component de couleur inspire de https://malcoded.com/posts/angular-color-picker/*/

import { AfterViewInit, Component, ElementRef, HostListener,
         ViewChild } from '@angular/core'
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { InterfaceOutils } from 'src/app/services/outils/interface-outils';

@Component({
  selector: 'app-glissiere-couleur',
  templateUrl: './glissiere-couleur.component.html',
  styleUrls: ['./glissiere-couleur.component.scss']
})

export class GlissiereCouleurComponent implements AfterViewInit, InterfaceOutils {
  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>

  private context2D: CanvasRenderingContext2D ;
  private sourisbas =  false
  private hauteurChoisi: number

  constructor(public gestionnaireCouleur: GestionnaireCouleursService) {}

  ngAfterViewInit() {
    this.draw();
  }

  draw() {

    if (!this.context2D) {
      this.context2D = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D
    }
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    this.context2D.clearRect(0, 0, width, height)

    const gradient = this.context2D.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)')
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)')
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)')
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)')
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)')

    this.context2D.beginPath()
    this.context2D.rect(0, 0, width, height)

    this.context2D.fillStyle = gradient
    this.context2D.fill()
    this.context2D.closePath()

    if (this.hauteurChoisi) {
      this.context2D.beginPath()
      this.context2D.strokeStyle = 'white'
      this.context2D.lineWidth = 5
      this.context2D.rect(0, this.hauteurChoisi - 5, width, 10)
      this.context2D.stroke()
      this.context2D.closePath()
    }
  }

  @HostListener('window:mouseup', ['$event'])
  sourisRelachee(evt: MouseEvent) {
    this.sourisbas = false
  }

  sourisEnfoncee(evt: MouseEvent) {
    this.sourisbas = true
    this.hauteurChoisi = evt.offsetY
    this.draw()
    this.couleurEmise(evt.offsetX, evt.offsetY)
  }

  sourisDeplacee(evt: MouseEvent) {
    if (this.sourisbas) {
      this.hauteurChoisi = evt.offsetY
      this.draw()
      this.couleurEmise(evt.offsetX, evt.offsetY)
    }
  }

  couleurEmise(x: number, y: number) {
    const rgbaCouleur = this.couleurPosition(x, y)
    this.gestionnaireCouleur.couleur = rgbaCouleur
    this.gestionnaireCouleur.teinte = rgbaCouleur
  }

  couleurPosition(x: number, y: number) {
    const imageData = this.context2D.getImageData(x, y, 1, 1).data;
    return ('RGB(' + imageData[0] + ',' + imageData[1] + ',' +
      imageData[2] + ')')
  }

}
