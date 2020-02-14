import { Component, Input } from '@angular/core';

import { OutilDessin, OUTIL_VIDE } from 'src/app/services/outils/gestionnaire-outils.service';

@Component({
  selector: 'app-outil-dessin',
  templateUrl: './outil-dessin.component.html',
  styleUrls: ['./outil-dessin.component.scss']
})
export class OutilDessinComponent {

  // Valeur par défaut pour les unit test
  @Input() outil: OutilDessin = OUTIL_VIDE;

}
