import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { GestionnaireCouleursService, Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';

@Component({
  selector: 'app-choix-couleur',
  templateUrl: './choix-couleur.component.html',
  styleUrls: ['./choix-couleur.component.scss'],
  providers: [GestionnaireCouleursService]
})
export class ChoixCouleurComponent  {

  @Input() portee: Portee = Portee.Principale;

  constructor(public gestionnaireCouleur: GestionnaireCouleursService,
              public dialogRef: MatDialogRef<ChoixCouleurComponent>) {}

  fermerFenetre() {
    this.dialogRef.close();
  }

  appliquerCouleur() {
    this.gestionnaireCouleur.appliquerCouleur(this.portee);
    this.dialogRef.close();
  }

}
