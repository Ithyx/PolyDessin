import { Injectable } from '@angular/core';
import { ElementDessin } from '../../stockage-svg/element-dessin';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { StockageSvgService } from '../../stockage-svg/stockage-svg.service';
import { Point } from '../dessin-ligne.service';
import { InterfaceOutils } from '../interface-outils';
import { SelectionBoxService } from './selection-box.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {
  boiteElementSelectionne = new RectangleService();

  elementSelectionne: ElementDessin;

  constructor(public stockageSVG: StockageSvgService,
              public selectionBox: SelectionBoxService
             ) {}

  traiterClic(element: ElementDessin) {
    console.log('selection a reçu', element);

    if (element !== this.elementSelectionne) {
      this.elementSelectionne = element;
      element.estSelectionne = true;
      this.creerBoiteEnglobanteElementDessin();
    }

  }

  sourisDeplacee(souris: MouseEvent) {
    //
  }

  sourisEnfoncee(souris: MouseEvent) {
    //
  }

  sourisRelachee() {
    //
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

    this.selectionBox.createSelectionBox(pointMin, pointMax);
  };

  creerBoiteEnglobanteElementDessin() {
    /* if (this.selectionEnCours) {
      this.stockageSVG.retirerDernierSVG();
    } */

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

      this.selectionBox.createSelectionBox(pointMin, pointMax);
    }
  };

  supprimerBoiteEnglobante() {
    /* if (this.outils.outilActif.ID === INDEX_OUTIL_SELECTION && this.selectionEnCours) {
      this.selectionEnCours = false;
      delete this.elementSelectionne;
      this.stockageSVG.retirerDernierSVG();
    } */
    if (this.elementSelectionne) {
      this.selectionBox.deleteSelectionBox();
      this.elementSelectionne.estSelectionne = false;
      delete this.elementSelectionne;
    }

  };

  estDansRectangleSelection(element: ElementDessin, rectangleSelection: RectangleService): boolean {
    let appartientX = false;
    let appartientY = false;
    for (const point of element.points) {
      if (point.x > rectangleSelection.points[0].x && point.x < rectangleSelection.points[1].x) {
        appartientX = true;
      } else {appartientX = false; };

      if (point.y > rectangleSelection.points[0].y && point.y < rectangleSelection.points[1].y) {
        appartientY = true;
      } else {appartientY = false}
    }

    return appartientX && appartientY;
  };

}
