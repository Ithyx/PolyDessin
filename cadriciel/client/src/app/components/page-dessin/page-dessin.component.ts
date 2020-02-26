import { Component, HostListener } from '@angular/core';
import { BrushToolService } from 'src/app/services/outils/brush-tool.service';
import { DrawSprayService } from 'src/app/services/outils/draw-spray.service';
import { LineToolService } from 'src/app/services/outils/line-tool.service';
import { DrawingToolService } from 'src/app/services/outils/pencil-tool.service';
import { RectangleToolService } from 'src/app/services/outils/rectangle-tool.service'
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { ToolInterface } from 'src/app/services/outils/tool-interface';
import { ToolManagerService } from 'src/app/services/outils/tool-manager.service';
import { GestionnaireRaccourcisService } from 'src/app/services/shortcuts-manager.service';

@Component({
  selector: 'app-page-dessin',
  templateUrl: './page-dessin.component.html',
  styleUrls: ['./page-dessin.component.scss']
})
export class PageDessinComponent {

  lexiqueOutils: Map<string, ToolInterface> = new Map<string, ToolInterface>();

  constructor(
              public outils: ToolManagerService,
              public crayon: DrawingToolService,
              public rectangle: RectangleToolService,
              public pinceau: BrushToolService,
              public ligne: LineToolService,
              public raccourcis: GestionnaireRaccourcisService,
              public selection: SelectionService,
              public spray: DrawSprayService  ) {
    this.lexiqueOutils.set('Crayon', crayon)
                      .set('Rectangle', rectangle)
                      .set('Ligne', ligne)
                      .set('Pinceau', pinceau)
                      .set('Selection', selection)
                      .set('Aérosol', spray);

  }

  @HostListener('document:keydown', ['$event'])
  toucheEnfoncee(event: KeyboardEvent) {
    this.raccourcis.treatInput(event);
  }

  @HostListener('document:keyup', ['$event'])
  toucheRelachee(event: KeyboardEvent) {
    this.raccourcis.treatReleaseKey(event);
  }

  sourisCliquee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMouseClick) {
      outil.onMouseClick(souris);
    }
  }

  sourisDeplacee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMouseMove) {
      outil.onMouseMove(souris);
    }
  }

  sourisEnfoncee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMousePress) {
      outil.onMousePress(souris);
    }
  }

  sourisRelachee(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMouseRelease) {
      outil.onMouseRelease(souris);
    }
  }

  sourisSortie(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMouseLeave) {
      outil.onMouseLeave(souris);
    }
  }

  sourisEntree(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onMouseEnter) {
      outil.onMouseEnter(souris);
    }
  }

  sourisDoubleClic(souris: MouseEvent) {
    const outil = this.lexiqueOutils.get(this.outils.activeTool.name);
    if (outil && outil.onDoubleClick) {
      outil.onDoubleClick(souris);
    }
  }

}
