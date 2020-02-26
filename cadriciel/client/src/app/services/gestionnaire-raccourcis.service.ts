import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandManagerService } from './command/command-manager.service';
import { GridService } from './grid/grid.service';
import { LineToolService } from './outils/line-tool.service';
import { RectangleToolService } from './outils/rectangle-tool.service';
import { ToolManagerService, PENCIL_TOOL_INDEX,
        LINE_TOOL_INDEX, BRUSH_TOOL_INDEX ,
        RECTANGLE_TOOL_INDEX, SELECTION_TOOL_INDEX } from './outils/tool-manager.service';
import { SelectionService } from './outils/selection/selection.service';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';

@Injectable({
  providedIn: 'root'
})
export class GestionnaireRaccourcisService {
  champDeTexteEstFocus = false;

  emitterNouveauDessin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(public outils: ToolManagerService,
              public dessinRectangle: RectangleToolService,
              public dessinLigne: LineToolService,
              public commands: CommandManagerService,
              public selection: SelectionService,
              public SVGStockage: SVGStockageService,
              public grid: GridService) { }

  viderSVGEnCours() {
    this.dessinRectangle.clear();
    this.dessinLigne.clear();
  }

  traiterInput(clavier: KeyboardEvent) {
    if (this.champDeTexteEstFocus) { return; };
    switch (clavier.key) {
      case '1':
        this.selection.deleteBoundingBox();
        this.outils.changeActiveTool(RECTANGLE_TOOL_INDEX);
        this.viderSVGEnCours();
        break;

      case 'a':
        clavier.preventDefault();
        if (clavier.ctrlKey && this.outils.activeTool.ID === SELECTION_TOOL_INDEX) {
          this.selection.deleteBoundingBox();
          this.selection.creerBoiteEnglobantePlusieursElementDessins(this.SVGStockage.getCompleteSVG());
        }
        break;

      case 'c':
        this.selection.deleteBoundingBox();
        this.outils.changeActiveTool(PENCIL_TOOL_INDEX);
        this.viderSVGEnCours();
        break;

      case 'l':
        this.selection.deleteBoundingBox();
        this.outils.changeActiveTool(LINE_TOOL_INDEX);
        this.viderSVGEnCours();
        break;

      case 'w':
        this.selection.deleteBoundingBox();
        this.outils.changeActiveTool(BRUSH_TOOL_INDEX);
        this.viderSVGEnCours();
        break;

      case 's':
        this.selection.deleteBoundingBox();
        this.outils.changeActiveTool(SELECTION_TOOL_INDEX);
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
        if (this.outils.activeTool.ID === RECTANGLE_TOOL_INDEX) {
          this.dessinRectangle.shiftPress();
        }
        if (this.outils.activeTool.ID === LINE_TOOL_INDEX) {
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
        if (this.outils.activeTool.ID === LINE_TOOL_INDEX) {
          this.dessinLigne.retirerPoint();
        }
        break;

      case 'Escape':
        if (this.outils.activeTool.ID === LINE_TOOL_INDEX) {
          this.dessinLigne.clear();
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
        if (this.outils.activeTool.ID === RECTANGLE_TOOL_INDEX) {
          this.dessinRectangle.shiftRelease();
        }
        if (this.outils.activeTool.ID === LINE_TOOL_INDEX) {
          this.dessinLigne.ShiftRelease();
        }
        break;

      default:
        break;
    }
  }
}
