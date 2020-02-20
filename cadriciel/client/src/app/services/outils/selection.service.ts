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
    let pointMin: Point = {x: elements[0].points[0].x , y: elements[0].points[0].y};
    let pointMax: Point = {x: elements[0].points[0].x , y: elements[0].points[0].y};

    for (const element of elements) {
      for (const point of element.points) {
        // Point Min
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
        }

        // Point Max
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
        }
      }
    }

    pointMin = {x: pointMin.x - 2, y: pointMin.y - 2};
    pointMax = {x: pointMax.x + 2, y: pointMax.y + 2};

    const boite = new RectangleService();
    boite.estSelectionne = true;
    boite.outil = this.outils.outilActif;

    boite.points[0] = pointMin;
    boite.points[1] = pointMax;
    boite.couleurSecondaire =  'rgba(0, 0, 0, 1)';

    boite.dessinerRectangle();

    this.stockageSVG.ajouterSVG(boite);
  };

  creerBoiteEnglobanteElementDessin() {
    if (this.selectionEnCours) {
      this.stockageSVG.retirerDernierSVG();
    }

    if (this.elementSelectionne.estPoint) {
      // TODO : l'element est un point
    } else {

      let pointMin: Point = {x: this.elementSelectionne.points[0].x , y: this.elementSelectionne.points[0].y};
      let pointMax: Point = {x: this.elementSelectionne.points[0].x , y: this.elementSelectionne.points[0].y};

      for (const point of this.elementSelectionne.points) {
        // Point Min
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
        }

        // Point Max
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
        }
      }

      pointMin = {x: pointMin.x - 2, y: pointMin.y - 2};
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

  estDansRectangleSelection(element: ElementDessin, rectangleSelection: RectangleService): boolean {    // Ou prend un point comme attribut ?
    // TODO: Vérification si l'un des points de l'élément dessinés se trouve dans le rectangle de selection
    return false;
  };

}
