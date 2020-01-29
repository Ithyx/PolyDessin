import { Component } from '@angular/core';
import { DessinCrayonService } from 'src/app/services/dessin-crayon.service';
import { DessinRectangleService } from 'src/app/services/dessin-rectangle.service'
import { StockageSvgService } from 'src/app/services/stockage-svg.service';
import { OutilDessin } from '../outil-dessin/outil-dessin.component';

@Component({
  selector: 'app-page-dessin',
  templateUrl: './page-dessin.component.html',
  styleUrls: ['./page-dessin.component.scss']
})
export class PageDessinComponent {

  outilActif: OutilDessin = {
    nom: 'Crayon',
    estActif: true,
    idOutil: 0,
    parametres: [
      {type: 'number', nom: 'Épaisseur'}
    ]
  };

  constructor(
    public stockage: StockageSvgService,
    private crayon: DessinCrayonService,
    private rectangle: DessinRectangleService
  ) { }

  onNotify(outil: OutilDessin) {
    console.log('nouvel outil sélectionné: ', outil)
    this.outilActif = outil;
  }

  onClick(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.crayon.onClickCrayon(mouse);
    }
  }

  onMouseMove(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon' && mouse.buttons === 1) {
      this.crayon.onMouseMoveCrayon(mouse);
    } else if (this.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseMoveRectangle(mouse);
    }
  }

  onMousePress(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.crayon.onMousePressCrayon(mouse);
    } else if (this.outilActif.nom === 'Rectangle') {
      this.rectangle.onMousePressRectangle(mouse);
    }
  }

  onMouseRelease(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.crayon.onMouseReleaseCrayon(mouse);
    } else if (this.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseReleaseRectangle(mouse);
    }
  }

  onMouseLeave(mouse: MouseEvent) {
    if (this.outilActif.nom === 'Crayon') {
      this.crayon.onMouseLeaveCrayon(mouse);
    } else if (this.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseLeaveRectangle(mouse);
    }
  }

}
