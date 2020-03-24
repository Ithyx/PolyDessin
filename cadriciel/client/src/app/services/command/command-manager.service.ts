import { Injectable } from '@angular/core';
import { CanvasConversionService } from '../canvas-conversion.service';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class CommandManagerService {
  drawingInProgress: boolean;  // Annuler-refaire désactivé si un dessin est en cours

  constructor(private canvasConversion: CanvasConversionService) {
    this.drawingInProgress = false;
  }

  executedCommands: Command[] = [];
  cancelledCommands: Command[] = [];

  execute(command: Command): void {
    this.executedCommands.push(command);
    this.cancelledCommands = [];
    this.canvasConversion.updateDrawing();
  }

  cancelCommand(): void {
    const command = this.executedCommands.pop();
    if (command) {
      command.undo();
      this.cancelledCommands.push(command);
      this.canvasConversion.updateDrawing();
    }
  }

  redoCommand(): void {
    const command = this.cancelledCommands.pop();
    if (command) {
      command.redo();
      this.executedCommands.push(command);
      this.canvasConversion.updateDrawing();
    }
  }

  clearCommand(): void {
    this.cancelledCommands = [];
    this.executedCommands = [];
    this.drawingInProgress = false;
  }
}
