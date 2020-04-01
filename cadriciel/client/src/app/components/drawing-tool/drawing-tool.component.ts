import { Component, Input } from '@angular/core';
import { DrawingTool, EMPTY_TOOL } from 'src/app/services/tools/tool-manager.service';

@Component({
  selector: 'app-drawing-tool',
  templateUrl: './drawing-tool.component.html',
  styleUrls: ['./drawing-tool.component.scss']
})
export class DrawingToolComponent {

  // Valeur par défaut pour les unit test
  @Input() tool: DrawingTool = EMPTY_TOOL;

  getActiveStatus(): string {
    return this.tool.isActive ? 'active' : 'inactive';
  }

}
