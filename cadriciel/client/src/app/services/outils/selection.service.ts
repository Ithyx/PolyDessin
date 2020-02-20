import { Injectable } from '@angular/core';
import { Point } from '../outils/dessin-ligne.service';
import { ElementDessin } from '../stockage-svg/element-dessin';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { GestionnaireOutilsService, INDEX_OUTIL_SELECTION} from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {
  selectionEnCours = false;
  elementSelectionne: ElementDessin;
  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) {
             }

  traiterClic(element: ElementDessin) {
    console.log('selection a reçu', element);

    if (element !== this.elementSelectionne) {
      this.elementSelectionne = element;
      this.creerBoiteEnglobanteElementDessin();
      element.estSelectionne = true;
      this.selectionEnCours = true;
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

  creerBoiteEnglobantePlusieursElementDessins(elements: ElementDessin[]) {
    // TODO : Trouvez le point min et le point max parmis tous les éléments
  };

  creerBoiteEnglobanteElementDessin() {
    if (this.selectionEnCours) {
      this.stockageSVG.retirerDernierSVG();
    }

    if (this.elementSelectionne.estPoint) {
      // TODO : l'element est un point
    } else {
      // on cherche le point avec un x et un y min
      let pointMin: Point = {x: this.elementSelectionne.points[0].x , y: this.elementSelectionne.points[0].y};
      for (const point of this.elementSelectionne.points) {
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
        }
      }

      pointMin = {x: pointMin.x - 2, y: pointMin.y - 2};

      // on cherche le point avec un x et un y max
      let pointMax: Point = {x: this.elementSelectionne.points[0].x , y: this.elementSelectionne.points[0].y};
      for (const point of this.elementSelectionne.points) {
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
        }
      }

      pointMax = {x: pointMax.x + 2, y: pointMax.y + 2};

      const boite = new RectangleService();
      boite.estSelectionne = true;
      boite.outil = this.outils.outilActif;

      boite.points[0] = pointMin;
      boite.points[1] = pointMax;
      boite.couleurSecondaire =  'rgba(0, 0, 0, 1)';

      boite.dessinerRectangle();

      this.stockageSVG.ajouterSVG(boite);
    }
  };

  supprimerBoiteEnglobante() {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION && this.selectionEnCours) {
      this.selectionEnCours = false;
      delete this.elementSelectionne;
      this.stockageSVG.retirerDernierSVG();
    }
  };

}
