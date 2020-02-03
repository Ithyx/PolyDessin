import { Component, HostListener } from '@angular/core';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { DessinCrayonService } from 'src/app/services/outils/dessin-crayon.service';
import { DessinPinceauService } from 'src/app/services/outils/dessin-pinceau.service';
import { DessinRectangleService } from 'src/app/services/outils/dessin-rectangle.service'
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
              private pinceau: DessinPinceauService,
              private raccourcis: GestionnaireRaccourcisService
    ) { }

  @HostListener('document:keydown', ['$event'])
  selectCrayon(event: KeyboardEvent) {
    this.raccourcis.traiterInput(event);
  }

  @HostListener('document:keyup', ['$event'])
  toucheRelachee(event: KeyboardEvent) {
    this.raccourcis.traiterToucheRelachee(event);
  }

  onClick(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onClickCrayon(mouse);
    }
    if (this.outils.outilActif.nom === 'Pinceau') {
      this.pinceau.onClickPinceau(mouse);
    }
  }

  onMouseMove(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon' && mouse.buttons === 1) {
      this.crayon.onMouseMoveCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseMoveRectangle(mouse);
    } else if (this.outils.outilActif.nom === 'Pinceau') {
      this.pinceau.onMouseMovePinceau(mouse);
    }
  }

  onMousePress(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMousePressCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMousePressRectangle(mouse);
    } else if (this.outils.outilActif.nom === 'Pinceau') {
      this.pinceau.onMousePressPinceau(mouse);
    }
  }

  onMouseRelease(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseReleaseCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Rectangle') {
      this.rectangle.onMouseReleaseRectangle(mouse);
    } else if (this.outils.outilActif.nom === 'Pinceau') {
      this.pinceau.onMouseReleasePinceau(mouse);
    }
  }

  onMouseLeave(mouse: MouseEvent) {
    if (this.outils.outilActif.nom === 'Crayon') {
      this.crayon.onMouseLeaveCrayon(mouse);
    } else if (this.outils.outilActif.nom === 'Pinceau') {
      this.pinceau.onMouseLeavePinceau(mouse);
    }
  }

}
