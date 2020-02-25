import { Injectable } from '@angular/core';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { ParametresCouleurService } from '../couleur/parametres-couleur.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})

export class DessinCrayonService implements InterfaceOutils {

  constructor(public SVGStockage: SVGStockageService,
              public outils: GestionnaireOutilsService,
              public couleur: ParametresCouleurService,
              public commands: CommandManagerService) { }

  trait = new TracePencilService();
  peutCliquer = true;

  sourisDeplacee(souris: MouseEvent) {
    if (this.commands.drawingInProgress) {
      this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
      this.actualiserSVG();
    }
  }

  sourisEnfoncee() {
    this.commands.drawingInProgress = true;
    this.actualiserSVG();
  }

  sourisRelachee() {
    if (this.commands.drawingInProgress) {
      if (this.trait.SVG.includes('L')) {
        // on ne stocke le path que s'il n'y a au moins une ligne
        this.commands.execute(new AddSVGService(this.trait, this.SVGStockage));
      }
      this.trait = new TracePencilService();
      this.commands.drawingInProgress = false;
      this.peutCliquer = true;
    }
  }

  sourisCliquee(souris: MouseEvent) {
    if (this.peutCliquer) {
      if (this.outils.outilActif.parametres[0].valeur) {
        this.trait.points.push({x: souris.offsetX, y: souris.offsetY});
        this.trait.isAPoint = true;
        this.actualiserSVG();
        this.commands.execute(new AddSVGService(this.trait, this.SVGStockage));
        this.trait = new TracePencilService();
      }
      this.commands.drawingInProgress = false;
    } else {this.peutCliquer = true};
  }

  sourisSortie() {
    if (this.commands.drawingInProgress) {
      this.commands.execute(new AddSVGService(this.trait, this.SVGStockage));
      this.trait = new TracePencilService();
      this.commands.drawingInProgress = false;
    }
    this.peutCliquer = false;
  }

  actualiserSVG() {
    this.trait.primaryColor = this.couleur.getCouleurPrincipale();
    this.trait.tool = this.outils.outilActif;
    this.trait.draw();
    this.SVGStockage.setOngoingSVG(this.trait);
  }
}
