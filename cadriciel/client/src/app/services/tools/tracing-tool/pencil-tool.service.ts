import { Injectable } from '@angular/core';
import { TracePencilService } from '../../stockage-svg/draw-element/trace/trace-pencil.service';
import { TracingToolService } from './tracing-tool.service';

@Injectable({
  providedIn: 'root'
})
export class PencilToolService extends TracingToolService {
  resetTrace(): void {
    this.trace = new TracePencilService();
    this.commands.drawingInProgress = false;
  }
}
