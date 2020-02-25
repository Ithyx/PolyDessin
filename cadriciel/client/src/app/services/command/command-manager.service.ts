import { Injectable } from '@angular/core';
import { Command } from './command';

@Injectable({
  providedIn: 'root'
})
export class CommandManagerService {
  drawingInProgress = false;  // Annuler-refaire désactivé si un dessin est en cours

  executedCommands: Command[] = [];
  cancelledCommands: Command[] = [];

  execute(command: Command) {
    this.executedCommands.push(command);
    this.cancelledCommands = [];
  }

  cancelCommand() {
    const command = this.executedCommands.pop();
    if (command) {
      command.undo();
      this.cancelledCommands.push(command);
    }
  }

  redoCommand() {
    const command = this.cancelledCommands.pop();
    if (command) {
      command.redo();
      this.executedCommands.push(command);
    }
  }

  clearCommand() {
    this.cancelledCommands = [];
    this.executedCommands = [];
    this.drawingInProgress = false;
  }
}
