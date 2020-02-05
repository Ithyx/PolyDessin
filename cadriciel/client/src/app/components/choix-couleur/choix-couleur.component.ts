import { Component, Input } from '@angular/core';
import { GestionnaireCouleursService, Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';

@Component({
  selector: 'app-choix-couleur',
  templateUrl: './choix-couleur.component.html',
  styleUrls: ['./choix-couleur.component.scss']
})
export class ChoixCouleurComponent  {

  @Input() portee: Portee = Portee.Principale;

  hue = 'rgba(255, 255, 255, 1)';
  couleur = 'rgba(255, 255, 255, 1)';

  constructor(public gestionnaireCouleurs: GestionnaireCouleursService) {}

  nouvelleHue(hue: string) {
    this.hue = hue;
    this.gestionnaireCouleurs.setCouleur(this.portee, this.hue);
  }

  nouvelleCouleur(couleur: string) {
    this.couleur = couleur;
    this.gestionnaireCouleurs.setCouleur(this.portee, this.couleur);
  }

}
