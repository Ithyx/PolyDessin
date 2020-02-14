import { Component, Input } from '@angular/core';

// L'extension VS de TSLint montre cet ordre comme érroné, mais le programme RSLint de node en CLI nous montre que cet ordre là est correct
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
