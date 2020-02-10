import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';

@Component({
  selector: 'app-choix-couleur',
  templateUrl: './choix-couleur.component.html',
  styleUrls: ['./choix-couleur.component.scss'],
  providers: [GestionnaireCouleursService]
})
export class ChoixCouleurComponent  {
  constructor(public gestionnaireCouleur: GestionnaireCouleursService,
              public dialogRef: MatDialogRef<ChoixCouleurComponent>) {}

  fermerFenetre() {
    this.dialogRef.close();
  }

  appliquerCouleur() {
    this.gestionnaireCouleur.appliquerCouleur();
    this.dialogRef.close();
  }

}
