import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { GridService } from './grid/grid.service';
import { DessinLigneService } from './outils/dessin-ligne.service';
import { DessinRectangleService } from './outils/dessin-rectangle.service';
import { GestionnaireOutilsService, INDEX_OUTIL_CRAYON,
        INDEX_OUTIL_LIGNE, INDEX_OUTIL_PINCEAU ,
        INDEX_OUTIL_RECTANGLE, INDEX_OUTIL_SELECTION } from './outils/gestionnaire-outils.service';
import { SelectionService } from './outils/selection/selection.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {
  champDeTexteEstFocus = false;

  emitterNouveauDessin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public outils: GestionnaireOutilsService,
              public dessinRectangle: DessinRectangleService,
              public dessinLigne: DessinLigneService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public SVGStockage: SVGStockageService,
              public grid: GridService) { }

  viderSVGEnCours() {
    this.dessinRectangle.vider();
    this.dessinLigne.vider();
  }

  traiterInput(clavier: KeyboardEvent) {
    if (this.champDeTexteEstFocus) { return; };
    switch (clavier.key) {
      case '1':
        this.selection.deleteBoundingBox();
        this.outils.changerOutilActif(INDEX_OUTIL_RECTANGLE);
        this.viderSVGEnCours();
        break;

      case 'a':
        clavier.preventDefault();
        if (clavier.ctrlKey && this.outils.outilActif.ID === INDEX_OUTIL_SELECTION) {
          this.selection.deleteBoundingBox();
          this.selection.creerBoiteEnglobantePlusieursElementDessins(this.SVGStockage.getCompleteSVG());
        }
        break;

      case 'c':
        this.selection.deleteBoundingBox();
        this.outils.changerOutilActif(INDEX_OUTIL_CRAYON);
        this.viderSVGEnCours();
        break;

      case 'l':
        this.selection.deleteBoundingBox();
        this.outils.changerOutilActif(INDEX_OUTIL_LIGNE);
        this.viderSVGEnCours();
        break;

      case 'w':
        this.selection.deleteBoundingBox();
        this.outils.changerOutilActif(INDEX_OUTIL_PINCEAU);
        this.viderSVGEnCours();
        break;

      case 's':
        this.selection.deleteBoundingBox();
        this.outils.changerOutilActif(INDEX_OUTIL_SELECTION);
        this.viderSVGEnCours();

      case 'z':
        if (clavier.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.cancelCommand();
        }
        break;

      case 'Z':
        if (clavier.ctrlKey && !this.commands.drawingInProgress) {
          this.commands.redoCommand();
        }
        break;

      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.shiftEnfonce();
        }
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.stockerCurseur();
        }
        break;

      case 'o':
        if (clavier.ctrlKey) {
          this.emitterNouveauDessin.next(false);
          clavier.preventDefault();
        }
        break;

      case 'Backspace':
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.retirerPoint();
        }
        break;

      case 'Escape':
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.vider();
        }
        break;

      case 'g':
        this.grid.showGrid = !this.grid.showGrid;
        break;

      case '+':
        this.grid.increaseSize();
        break;

      case '-':
        this.grid.decreaseSize();
        break;

      default:
        break;
    }
  }

  traiterToucheRelachee(clavier: KeyboardEvent) {
    switch (clavier.key) {
      case 'Shift':
        if (this.outils.outilActif.ID === INDEX_OUTIL_RECTANGLE) {
          this.dessinRectangle.shiftRelache();
        }
        if (this.outils.outilActif.ID === INDEX_OUTIL_LIGNE) {
          this.dessinLigne.shiftRelache();
        }
        break;

      default:
        break;
    }
  }
}
