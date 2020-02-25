import { Injectable } from '@angular/core';
import { DrawElement } from '../../stockage-svg/draw-element';
import { RectangleService } from '../../stockage-svg/rectangle.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { Point } from '../dessin-ligne.service';
import { InterfaceOutils } from '../interface-outils';
import { GestionnaireDessinService } from './../../gestionnaire-dessin/gestionnaire-dessin.service'
import { SelectionBoxService } from './selection-box.service';
import { SelectionRectangleService } from './selection-rectangle.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements InterfaceOutils {
  boiteElementSelectionne = new RectangleService();
  elementSelectionne: DrawElement[] = [];

  constructor(public SVGStockage: SVGStockageService,
              public selectionBox: SelectionBoxService,
              public selectionRectangle: SelectionRectangleService,
              public gestionnaireDessin: GestionnaireDessinService
             ) {}

  traiterClic(element: DrawElement) {
    this.supprimerBoiteEnglobante();

    if (!this.elementSelectionne.includes(element)) {
      this.elementSelectionne.push(element);
      element.isSelected = true;
      this.creerBoiteEnglobanteElementDessin();
    }

  }

  sourisDeplacee(souris: MouseEvent) {
    this.selectionRectangle.sourisDeplacee(souris);
    if (this.selectionRectangle.selectionEnCours) {
      this.supprimerBoiteEnglobante();
      // Éviter de créer une boite de sélection si on effectue un simple clic
      if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
        this.estDansRectangleSelection(this.selectionRectangle.rectangle);
        this.creerBoiteEnglobanteElementDessin();
      }
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    this.supprimerBoiteEnglobante();
    this.selectionRectangle.sourisEnfoncee(souris);
  }

  sourisRelachee() {
    // Éviter de créer une boite de sélection si on effectue un simple clic
    if (this.selectionRectangle.rectangle.getWidth() !== 0 || this.selectionRectangle.rectangle.getHeight() !== 0) {
      this.estDansRectangleSelection(this.selectionRectangle.rectangle);
      this.creerBoiteEnglobanteElementDessin();
    }
    this.selectionRectangle.sourisRelachee();
    this.selectionRectangle.rectangle = new RectangleService();
  }

  creerBoiteEnglobantePlusieursElementDessins(elements: Map<number, DrawElement>) {
    let pointMin: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};
    let pointMax: Point = {x: elements.values().next().value.points[0].x, y: elements.values().next().value.points[0].y};

    for (const element of elements) {
      element[1].isSelected = true;
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

    let pointMin: Point = {x: this.gestionnaireDessin.largeur , y: this.gestionnaireDessin.hauteur};
    let pointMax: Point = {x: 0 , y: 0};
    const epaisseurMin: Point = {x: 0, y: 0};
    const epaisseurMax: Point = {x: 0, y: 0};

    for (const element of this.elementSelectionne) {
      for (const point of element.points) {
        // Point Min
        if (pointMin.x > point.x) {
          pointMin.x = point.x;
          epaisseurMin.x = element.thickness ? element.thickness : 0;
        }
        if (pointMin.y > point.y) {
          pointMin.y = point.y;
          epaisseurMin.y = element.thickness ? element.thickness : 0;
        }

        // Point Max
        if (pointMax.x < point.x) {
          pointMax.x = point.x;
          epaisseurMax.x = element.thickness ? element.thickness : 0;
        }
        if (pointMax.y < point.y) {
          pointMax.y = point.y;
          epaisseurMax.y = element.thickness ? element.thickness : 0;
        }
      }
    }
    pointMin = {x: pointMin.x - 0.5 * epaisseurMin.x, y: pointMin.y - 0.5 * epaisseurMin.y};
    pointMax = {x: pointMax.x + 0.5 * epaisseurMax.x, y: pointMax.y + 0.5 * epaisseurMax.y};
    this.selectionBox.createSelectionBox(pointMin, pointMax);
  };

  supprimerBoiteEnglobante() {
    if (this.elementSelectionne) {
      this.selectionBox.deleteSelectionBox();

      for (const element of this.elementSelectionne) {
        element.isSelected = false;
        this.elementSelectionne.pop();
      }
    }

  };

  estDansRectangleSelection(rectangleSelection: RectangleService) {
    let belongInX = false;
    let belongInY = false;
    let belongToRectangle = false;

    for (const element of this.SVGStockage.getCompleteSVG()) {
      for (const point of element[1].points) {
        if (point.x >= rectangleSelection.points[0].x && point.x <= rectangleSelection.points[1].x) {
          belongInX = true;
        } else {belongInX = false; };

        if (point.y >= rectangleSelection.points[0].y && point.y <= rectangleSelection.points[1].y) {
          belongInY = true;
        } else {belongInY = false}

        if (belongInX && belongInY) {
          belongToRectangle = true;
        }
      }
      if (belongToRectangle) {
        element[1].isSelected = true;
        this.elementSelectionne.push(element[1]);
        belongToRectangle = false;
      }
    }
  };

}
