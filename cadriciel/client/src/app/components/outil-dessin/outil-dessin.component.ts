import { Component, Input } from '@angular/core';

import { DrawingTool, EMPTY_TOOL } from 'src/app/services/tools/tool-manager.service';

@Component({
  selector: 'app-outil-dessin',
  templateUrl: './outil-dessin.component.html',
  styleUrls: ['./outil-dessin.component.scss']
})
export class OutilDessinComponent {

  // Valeur par défaut pour les unit test
  @Input() outil: DrawingTool = EMPTY_TOOL;

}
