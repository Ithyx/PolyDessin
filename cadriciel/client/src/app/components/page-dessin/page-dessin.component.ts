import { Component, HostListener } from '@angular/core';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { DessinCrayonService } from 'src/app/services/outils/dessin-crayon.service';
import { DessinLigneService } from 'src/app/services/outils/dessin-ligne.service';
import { DessinPinceauService } from 'src/app/services/outils/dessin-pinceau.service';
import { DessinRectangleService } from 'src/app/services/outils/dessin-rectangle.service'
import { GestionnaireOutilsService } from 'src/app/services/outils/gestionnaire-outils.service';
import { InterfaceOutils } from 'src/app/services/outils/interface-outils';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

@Component({
  selector: 'app-page-dessin',
  templateUrl: './page-dessin.component.html',
  styleUrls: ['./page-dessin.component.scss']
})
export class PageDessinComponent {

  lexiqueOutils: Map<string, InterfaceOutils> = new Map<string, InterfaceOutils>();

  constructor(public stockage: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public crayon: DessinCrayonService,
              public rectangle: DessinRectangleService,
              public pinceau: DessinPinceauService,
              public ligne: DessinLigneService,
              public raccourcis: GestionnaireRaccourcisService
  ) {
    this.lexiqueOutils.set('Crayon', crayon)
                      .set('Rectangle', rectangle)
                      .set('Ligne', ligne)
                      .set('Pinceau', pinceau);
  }

  @HostListener('document:keydown', ['$event'])
  toucheEnfoncee(event: KeyboardEvent) {
    this.raccourcis.traiterInput(event);
  }

  @HostListener('document:keyup', ['$event'])
  toucheRelachee(event: KeyboardEvent) {
    this.raccourcis.traiterToucheRelachee(event);
  }

  sourisCliquee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisCliquee) {
      outil.sourisCliquee(souris);
    }
  }

  sourisDeplacee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisDeplacee) {
      outil.sourisDeplacee(souris);
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisEnfoncee) {
      outil.sourisEnfoncee(souris);
    }
  }

  sourisRelachee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisRelachee) {
      outil.sourisRelachee(souris);
    }
  }

  sourisSortie(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisSortie) {
      outil.sourisSortie(souris);
    }
  }

  sourisEntree(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisEntree) {
      outil.sourisEntree(souris);
    }
  }

  sourisDoubleClic(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.outilActif.nom);
    if (outil && outil.sourisDoubleClic) {
      outil.sourisDoubleClic(souris);
    }
  }

}
