import { Component, HostListener } from '@angular/core';
import { DessinCrayonService } from 'src/app/services/dessin-crayon.service';
import { GestionnaireOutilsService } from 'src/app/services/outils/gestionnaire-outils.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

@Component({
  selector: 'app-page-dessin',
  templateUrl: './page-dessin.component.html',
  styleUrls: ['./page-dessin.component.scss']
})
export class PageDessinComponent {

  constructor(public stockage: StockageSvgService,
              private outils: GestionnaireOutilsService,
              private crayon: DessinCrayonService,
    ) { }

  @HostListener('document:keydown', ['$event'])
  selectCrayon(event: KeyboardEvent) {
    console.log('crayon sélectionné touche: ', event.key);
  }

  onClick(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onClickCrayon(mouse);
    }
  }

  onMouseMove(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon' && mouse.buttons === 1) {
      this.crayon.onMouseMoveCrayon(mouse);
    }
  }

  onMousePress(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMousePressCrayon(mouse);
    }
  }

  onMouseRelease(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseReleaseCrayon(mouse);
    }
  }

  onMouseLeave(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseLeaveCrayon(mouse);
    }
  }

}
