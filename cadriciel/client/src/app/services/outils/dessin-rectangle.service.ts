import { Injectable } from '@angular/core';
import { AjoutSvgService } from '../commande/ajout-svg.service';
import { GestionnaireCommandesService } from '../commande/gestionnaire-commandes.service';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { StockageSvgService } from '../stockage-svg/stockage-svg.service';
import { Point } from './dessin-ligne.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service'
import { InterfaceOutils } from './interface-outils'

@Injectable({
  providedIn: 'root'
})
export class DessinRectangleService implements InterfaceOutils {
  rectangle = new RectangleService();
  // Coordonnées du clic initial de souris
  initial: Point = {x: 0, y: 0};
  // Coordonnées du point inférieur gauche
  baseCalculee: Point = {x: 0, y: 0};
  // Dimensions du rectangle
  largeurCalculee = 0;
  hauteurCalculee = 0;

  constructor(public stockageSVG: StockageSvgService,
              public outils: GestionnaireOutilsService,
              public couleur: ParametresCouleurService,
              public commandes: GestionnaireCommandesService) { }

  actualiserSVG() {
    this.rectangle.outil = this.outils.outilActif;
    this.rectangle.couleurPrincipale = this.couleur.getCouleurPrincipale();
    this.rectangle.couleurSecondaire = this.couleur.getCouleurSecondaire();
    this.rectangle.dessiner();
    this.stockageSVG.setSVGEnCours(this.rectangle);
  }

  sourisDeplacee(souris: MouseEvent) {
    if (this.commandes.dessinEnCours) {
      // Calcule des valeurs pour former un rectangle
      this.largeurCalculee = Math.abs(this.initial.x - souris.offsetX);
      this.hauteurCalculee = Math.abs(this.initial.y - souris.offsetY);
      this.baseCalculee.x = Math.min(this.initial.x, souris.offsetX);
      this.baseCalculee.y = Math.min(this.initial.y, souris.offsetY);
      // Si shift est enfoncé, les valeurs calculées sont ajustées pour former un carré
      if (souris.shiftKey) {
        this.shiftEnfonce();
      } else {
        this.shiftRelache();
      }
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    if (!this.commandes.dessinEnCours) {
      this.commandes.dessinEnCours = true;
      this.initial.x = souris.offsetX;
      this.initial.y = souris.offsetY;
      this.rectangle.largeur = 0;
      this.rectangle.hauteur = 0;
    }
  }

  sourisRelachee() {
    this.commandes.dessinEnCours = false;
    // On évite de créer des formes vides
    if (this.rectangle.largeur !== 0 || this.rectangle.hauteur !== 0) {
      this.commandes.executer(new AjoutSvgService(this.rectangle, this.stockageSVG));
    }
    this.baseCalculee = {x: 0, y: 0};
    this.hauteurCalculee = 0;
    this.largeurCalculee = 0;
    this.rectangle = new RectangleService();
  }

  shiftEnfonce() {
    if (this.commandes.dessinEnCours) {
      // Lorsque la touche 'shift' est enfoncée, la forme à dessiner est un carré
      if (this.largeurCalculee < this.hauteurCalculee) {
        this.rectangle.base.y = (this.baseCalculee.y === this.initial.y) ?
          this.baseCalculee.y : (this.baseCalculee.y + (this.hauteurCalculee - this.largeurCalculee));
        this.rectangle.base.x = this.baseCalculee.x;
        this.rectangle.hauteur = this.largeurCalculee;
        this.rectangle.largeur = this.largeurCalculee;
      } else {
        this.rectangle.base.x = (this.baseCalculee.x === this.initial.x) ?
          this.baseCalculee.x : (this.baseCalculee.x + (this.largeurCalculee - this.hauteurCalculee));
        this.rectangle.base.y = this.baseCalculee.y;
        this.rectangle.largeur = this.hauteurCalculee;
        this.rectangle.hauteur = this.hauteurCalculee;
      }
      this.actualiserSVG();
    }
  }

  shiftRelache() {
    if (this.commandes.dessinEnCours) {
      // Lorsque la touche 'shift' est relâchée, la forme à dessiner est un rectangle
      this.rectangle.base.x = this.baseCalculee.x;
      this.rectangle.base.y = this.baseCalculee.y;
      this.rectangle.hauteur = this.hauteurCalculee;
      this.rectangle.largeur = this.largeurCalculee;
      this.actualiserSVG();
    }
  }

  vider() {
    this.commandes.dessinEnCours = false;
    this.rectangle = new RectangleService();
  }
}
