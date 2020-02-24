import { Injectable } from '@angular/core';
import { ElementDessin } from '../../../../../../common/communication/element-dessin';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { StockageSvgService } from '../../stockage-svg/stockage-svg.service';
import { Point } from '../dessin-ligne.service';
import { InterfaceOutils } from '../interface-outils';
import { SelectionBoxService } from './selection-box.service';
import { SelectionRectangleService } from './selection-rectangle.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {
  boiteElementSelectionne = new RectangleService();

  elementSelectionne: ElementDessin[] = [];

  constructor(public stockageSVG: StockageSvgService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService
             ) {}

  traiterClic(element: ElementDessin) {
    console.log('selection a reçu', element);

    this.supprimerBoiteEnglobante();

    if (!this.elementSelectionne.includes(element)) {
      this.elementSelectionne.push(element);
      element.estSelectionne = true;
      this.creerBoiteEnglobanteElementDessin();
    }

  }

  sourisDeplacee(souris: MouseEvent) {
    this.selectionRectangle.sourisDeplacee(souris);
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.selectionRectangle.sourisEnfoncee(souris);
  }

  sourisRelachee() {
    this.selectionRectangle.sourisRelachee();
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

    let pointMin: Point = {x: this.elementSelectionne[0].points[0].x , y: this.elementSelectionne[0].points[0].y};
    let pointMax: Point = {x: this.elementSelectionne[0].points[0].x , y: this.elementSelectionne[0].points[0].y};

    for (const element of this.elementSelectionne) {
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

    this.selectionBox.createSelectionBox(pointMin, pointMax);
  };

  supprimerBoiteEnglobante() {
    if (this.elementSelectionne) {
      this.selectionBox.deleteSelectionBox();

      for (const element of this.elementSelectionne) {
        element.estSelectionne = false;
        this.elementSelectionne.pop();
      }
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
