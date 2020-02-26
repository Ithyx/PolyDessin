import { Injectable } from '@angular/core';
import { AddSVGService } from '../command/add-svg.service';
import { CommandManagerService } from '../command/command-manager.service';
import { ColorParameterService } from '../couleur/color-parameter.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { GestionnaireOutilsService } from './gestionnaire-outils.service';
import { InterfaceOutils } from './interface-outils';

@Injectable({
  providedIn: 'root'
})
export class DessinPinceauService implements InterfaceOutils {

  constructor(public SVGStockage: SVGStockageService,
              public outils: GestionnaireOutilsService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService) { }

  trait = new TraceBrushService();
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
      this.trait = new TraceBrushService();
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
        this.trait = new TraceBrushService();
      }
      this.commands.drawingInProgress = false;
    } else {this.peutCliquer = true};
  }

  sourisSortie() {
    if (this.commands.drawingInProgress) {
      this.commands.execute(new AddSVGService(this.trait, this.SVGStockage));
      this.trait = new TraceBrushService();
      this.commands.drawingInProgress = false;
    }
    this.peutCliquer = false;
  }

  actualiserSVG() {
    this.trait.primaryColor = this.colorParameter.getPrimaryColor();
    this.trait.tool = this.outils.outilActif;
    this.trait.draw();
    this.SVGStockage.setOngoingSVG(this.trait);
  }
}
