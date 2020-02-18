import { Injectable } from '@angular/core';
import { Point } from '../outils/dessin-ligne.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { TraitCrayonService } from '../stockage-svg/trait-crayon.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) { }

  // Cliquee sélectionne l'objet
  sourisCliquee(evenement: MouseEvent, cle: number) {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      console.log('selection', evenement, cle);

    }
  }

  // Garder la souris enfoncee créait un rectangle de sélection

  // Méthode pour la création de la "hitbox"
  creerBoiteEnglobanteTraitCrayon(trait: TraitCrayonService) {

    // Vérification si le trait n'est pas juste un point
    if (trait.estPoint) {
      // TODO: Créer Rectangle englobant le point
    } else {
      // on cherche le point avec un x et un y min
      const pointMin: Point = {x: trait.points[0].x , y: trait.points[0].y};
      for (const point of trait.points) {
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
        }
      }

      // on cherche le point avec un x et un y max
      const pointMax: Point = {x: trait.points[0].x , y: trait.points[0].y};
      for (const point of trait.points) {
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
        }
      }
    }

    // TODO: Créer Rectangle englobant le trait soit du point min vers le point max

  };

}
