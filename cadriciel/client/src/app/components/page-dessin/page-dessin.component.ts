import { Component, HostListener } from '@angular/core';
import { DessinCrayonService } from 'src/app/services/dessin-crayon.service';
import { DessinRectangleService } from 'src/app/services/dessin-rectangle.service'
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
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
              private rectangle: DessinRectangleService,
              private raccourcis: GestionnaireRaccourcisService
    ) { }

  @HostListener('document:keydown', ['$event'])
  selectCrayon(event: KeyboardEvent) {
    this.raccourcis.traiterInput(event);
  }

  onClick(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onClickCrayon(mouse);
    }
  }

  onMouseMove(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon' && mouse.buttons === 1) {
      this.crayon.onMouseMoveCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseMoveRectangle(mouse);
    }
  }

  onMousePress(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMousePressCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMousePressRectangle(mouse);
    }
  }

  onMouseRelease(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseReleaseCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseReleaseRectangle(mouse);
    }
  }

  onMouseLeave(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseLeaveCrayon(mouse);
    }
  }

}
