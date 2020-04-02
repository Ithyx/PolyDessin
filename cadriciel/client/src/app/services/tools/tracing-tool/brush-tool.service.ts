import { Injectable } from '@angular/core';
import { TraceBrushService } from '../../stockage-svg/trace/trace-brush.service';
import { TracingToolService } from './tracing-tool.service';

@Injectable({
  providedIn: 'root'
})
export class BrushToolService extends TracingToolService {
  resetTrace(): void {
    this.trace = new TraceBrushService();
    this.commands.drawingInProgress = false;
  }
}
