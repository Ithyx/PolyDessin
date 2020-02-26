import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { ColorManagerService, Scope } from 'src/app/services/color/color-manager.service';

@Component({
  selector: 'app-choix-couleur',
  templateUrl: './choix-couleur.component.html',
  styleUrls: ['./choix-couleur.component.scss'],
  providers: [ColorManagerService]
})
export class ChoixCouleurComponent  {

  portee: Scope = Scope.Primary;

  constructor(public gestionnaireCouleur: ColorManagerService,
              public dialogRef: MatDialogRef<ChoixCouleurComponent>) {}

  fermerFenetre() {
    this.dialogRef.close();
  }

  appliquerCouleur() {
    this.gestionnaireCouleur.applyColor(this.portee);
    this.dialogRef.close();
  }

}
