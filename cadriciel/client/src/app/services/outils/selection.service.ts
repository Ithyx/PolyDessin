import { Injectable } from '@angular/core';
import { Point } from '../outils/dessin-ligne.service';
import { ElementDessin } from '../stockage-svg/element-dessin';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { GestionnaireOutilsService} from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) { }

  traiterClic(element: ElementDessin) {
    console.log('selection a reçu', element);

    if (!element.estSelectionne) {
      this.creerBoiteEnglobanteElementDessin(element);
      element.estSelectionne = true;
    }
  }

  // Garder la souris enfoncee doit créer un rectangle de sélection
  sourisEnfoncee(evenement: MouseEvent) {
    // TODO
  }

  // Le racourci CTRL+A doit sélectionner tous les objets
  selectionneTousLesObjets() {
    // TODO
  }

  creerBoiteEnglobanteElementDessin(element: ElementDessin) {

    if (element.estPoint) {
      // TODO : l'element est un point
    } else {
      // on cherche le point avec un x et un y min
    let pointMin: Point = {x: element.points[0].x , y: element.points[0].y};
    for (const point of element.points) {
      if (pointMin.x > point.x) {
        pointMin.x = point.x;
      }
      if (pointMin.y > point.y) {
        pointMin.y = point.y;
      }
    }

    pointMin = {x: pointMin.x - 3, y: pointMin.y - 3};

    // on cherche le point avec un x et un y max
    let pointMax: Point = {x: element.points[0].x , y: element.points[0].y};
    for (const point of element.points) {
      if (pointMax.x < point.x) {
        pointMax.x = point.x;
      }
      if (pointMax.y < point.y) {
        pointMax.y = point.y;
      }
    }

    pointMax = {x: pointMax.x + 3, y: pointMax.y + 3};

    const boite = new RectangleService();

    boite.outil = this.outils.outilActif;

    boite.base = pointMin;
    boite.largeur = pointMax.x - pointMin.x;
    boite.hauteur = pointMax.y - pointMin.y;
    boite.couleurSecondaire =  'rgba(0, 0, 0, 1)';

    boite.dessinerRectangle();

    this.stockageSVG.ajouterSVG(boite);
    console.log('Boite Englobante', boite);
  }

  };

}
