import { Injectable } from '@angular/core';
import { Point } from '../outils/dessin-ligne.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { TraitCrayonService } from '../stockage-svg/trait-crayon.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {

  boiteDeSelection: RectangleService;

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) { }

  // Cliquee sélectionne l'objet
  traiterClic(element: TraitCrayonService) {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      console.log('selection', element);

      this.creerBoiteEnglobanteTraitCrayon(element);
    }
  }

  // Garder la souris enfoncee créait un rectangle de sélection
  sourisEnfoncee(evenement: MouseEvent) {
    // TODO
  }

  // Méthode pour la création de la "hitbox"
  creerBoiteEnglobanteTraitCrayon(trait: TraitCrayonService) {

    console.log('Jai reçu un trait avec:', trait);

    // Vérification si le trait n'est pas juste un point
    // TODO: Créer Rectangle englobant le point

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
      // TODO: Créer Rectangle englobant le trait soit du point min vers le point max

    this.boiteDeSelection.base = pointMin;
    this.boiteDeSelection.largeur = pointMax.x - pointMin.x;
    this.boiteDeSelection.hauteur = pointMax.y - pointMin.y;

    this.boiteDeSelection.couleurSecondaire =  'rgba(255,255,255,1)';

    this.stockageSVG.ajouterSVG(this.boiteDeSelection);
    console.log('Boite Englobante', this.boiteDeSelection);

  };

}
