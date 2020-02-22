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
  boiteElementSelectionne = new RectangleService();
  rectangleSelection = new RectangleService();

  initial: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  baseCalculee: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  largeurCalculee = 0;
  hauteurCalculee = 0;

  selectionEnCours = false;
  elementSelectionne: ElementDessin;

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
             ) {}

  traiterClic(element: ElementDessin) {
    console.log('selection a reçu', element);

    if (element !== this.elementSelectionne) {
      this.elementSelectionne = element;
      this.creerBoiteEnglobanteElementDessin();
      element.estSelectionne = true;
      this.selectionEnCours = true;
    }
  }

  sourisDeplacee(souris: MouseEvent) {
    // Calcule des valeurs pour former un rectangle
    this.largeurCalculee = Math.abs(this.initial.x - souris.offsetX);
    this.hauteurCalculee = Math.abs(this.initial.y - souris.offsetY);
    this.baseCalculee.x = Math.min(this.initial.x, souris.offsetX);
    this.baseCalculee.y = Math.min(this.initial.y, souris.offsetY);
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.initial = {x: souris.offsetX, y: souris.offsetY};
  }

  sourisRelachee() {
    this.baseCalculee = {x: 0, y: 0};
    this.hauteurCalculee = 0;
    this.largeurCalculee = 0;
    this.rectangleSelection = new RectangleService();
  }

  creerBoiteEnglobantePlusieursElementDessins(elements: Map<number, ElementDessin>) {
    let pointMin: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};
    let pointMax: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};

    for (const element of elements) {
      element[1].estSelectionne = true;
      for (const point of element[1].points) {
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

    this.boiteElementSelectionne.estSelectionne = true;
    this.boiteElementSelectionne.outil = this.outils.outilActif;

    this.boiteElementSelectionne.points[0] = pointMin;
    this.boiteElementSelectionne.points[1] = pointMax;
    this.boiteElementSelectionne.couleurSecondaire =  'rgba(0, 80, 150, 1)';

    this.boiteElementSelectionne.dessinerRectangle();

    this.stockageSVG.ajouterSVG(this.boiteElementSelectionne);

    this.selectionEnCours = true;
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

      this.boiteElementSelectionne.estSelectionne = true;
      this.boiteElementSelectionne.outil = this.outils.outilActif;

      this.boiteElementSelectionne.points[0] = pointMin;
      this.boiteElementSelectionne.points[1] = pointMax;
      this.boiteElementSelectionne.couleurSecondaire =  'rgba(0, 0, 0, 1)';

      this.boiteElementSelectionne.dessinerRectangle();

      this.stockageSVG.ajouterSVG(this.boiteElementSelectionne);

      this.selectionEnCours = true;
    }
  };

  supprimerBoiteEnglobante() {
    if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION && this.selectionEnCours) {
      this.selectionEnCours = false;
      delete this.elementSelectionne;
      this.stockageSVG.retirerDernierSVG();
    }
  };

  estDansRectangleSelection(element: ElementDessin, rectangleSelection: RectangleService): boolean {
    let appartientX = false;
    let appartientY = false;
    for (const point of element.points) {
      if (point.x > rectangleSelection.points[0].x && point.x < rectangleSelection.points[1].x) {
        appartientX = true;
      } else {appartientX = false;};

      if (point.y > rectangleSelection.points[0].y && point.y < rectangleSelection.points[1].y) {
        appartientY = true;
      } else {appartientY = false}
    }

    return appartientX && appartientY;
  };

}
