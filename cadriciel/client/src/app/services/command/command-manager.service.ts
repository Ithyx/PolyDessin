import { Injectable } from '@angular/core';
import { CanvasConversionService } from '../canvas-conversion.service';
import { LocalSaveManagerService } from '../saving/local/local-save-manager.service';
import { SelectionBoxService } from '../tools/selection/selection-box.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class CommandManagerService {
  drawingInProgress: boolean;  // Annuler-refaire désactivé si un dessin est en cours

  private executedCommands: Command[] = [];
  private cancelledCommands: Command[] = [];

  constructor(private canvasConversion: CanvasConversionService,
              private localSaving: LocalSaveManagerService,
              private selectionBox: SelectionBoxService) {
    this.drawingInProgress = false;
  }

  execute(command: Command): void {
    this.executedCommands.push(command);
    this.cancelledCommands = [];
    this.canvasConversion.updateDrawing();
    this.localSaving.saveState();
  }

  cancelCommand(): void {
    const command = this.executedCommands.pop();
    if (command) {
      command.undo();
      this.cancelledCommands.push(command);
      this.canvasConversion.updateDrawing();
      this.localSaving.saveState();
      if (this.selectionBox.box) {
        this.selectionBox.deleteSelectionBox();
      }
    }
  }

  redoCommand(): void {
    const command = this.cancelledCommands.pop();
    if (command) {
      command.redo();
      this.executedCommands.push(command);
      this.canvasConversion.updateDrawing();
      this.localSaving.saveState();
    }
  }

  clearCommand(): void {
    this.cancelledCommands = [];
    this.executedCommands = [];
    this.drawingInProgress = false;
  }

  hasExecutedCommands(): boolean {
    return this.executedCommands.length > 0;
  }

  hasCancelledCommands(): boolean {
    return this.cancelledCommands.length > 0;
  }
}
