import { Injectable } from '@angular/core';
import { CommandManagerService } from './command/command-manager.service';
import { RemoveSVGService } from './command/remove-svg.service';
import { DrawElement /*, Point*/ } from './stockage-svg/draw-element/draw-element';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { SelectionService } from './tools/selection/selection.service';
// import { AddSVGService } from './command/add-svg.service';

// const PASTE_OFFSET: Point = {x: 10, y: 10};

@Injectable({
  providedIn: 'root'
})

export class ClipboardService {

  public selectedElementCopy: DrawElement[];
  private removeCommand: RemoveSVGService;

  constructor(private selection: SelectionService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService
              ) {
                this.selectedElementCopy = [];
                this.removeCommand = new RemoveSVGService(this.svgStockage);
              }

  copySelectedElement(): void {
    this.selectedElementCopy = {...this.selection.selectedElements};
    console.log(this.selectedElementCopy);
  }

  cutSelectedElement(): void {
    // TODO
  }

  duplicateSelectedElement(): void {
    // TODO
  }

  deleteSelectedElement(): void {
    this.removeCommand.addElements(this.selection.selectedElements);

    if (!this.removeCommand.isEmpty()) {
      this.commands.execute(this.removeCommand);
      this.selection.deleteBoundingBox();
    }
  }

  pasteSelectedElement(): void {
    // TODO
  }
}
