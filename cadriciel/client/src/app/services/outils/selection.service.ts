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

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) { }

  // Cliquee sélectionne l'objet
  traiterClic(element: TraitCrayonService) {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
      console.log('selection a reçu', element);
      console.log('avec les points:', element.points);

      this.creerBoiteEnglobanteTraitCrayon(element);
    }
  }

  // Garder la souris enfoncee créait un rectangle de sélection
  sourisEnfoncee(evenement: MouseEvent) {
    // TODO
  }

  // Méthode pour la création de la "hitbox"
  creerBoiteEnglobanteTraitCrayon(trait: TraitCrayonService) {

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

    console.log('pointMax', pointMax);
    console.log('pointMin', pointMin);

    const boite = new RectangleService();

    boite.outil = this.outils.outilActif;

    boite.perimetre = '1';
    boite.base.x = pointMin.x;
    boite.base.y = pointMin.y;
    boite.largeur = pointMax.x - pointMin.x;
    boite.hauteur = pointMax.y - pointMin.y;

    boite.couleurSecondaire =  'rgba(0, 0, 0, 1)';

    boite.dessinerRectangle();

    this.stockageSVG.ajouterSVG(boite);
    console.log('Boite Englobante', boite);

  };

}
