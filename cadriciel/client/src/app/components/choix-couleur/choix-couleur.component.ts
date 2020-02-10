import { Component, Input } from '@angular/core';
import { GestionnaireCouleursService, Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';

@Component({
  selector: 'app-choix-couleur',
  templateUrl: './choix-couleur.component.html',
  styleUrls: ['./choix-couleur.component.scss'],
  providers: [GestionnaireCouleursService]
})
export class ChoixCouleurComponent  {

  @Input() portee: Portee = Portee.Principale;

  constructor(public couleur: GestionnaireCouleursService) {}

}
