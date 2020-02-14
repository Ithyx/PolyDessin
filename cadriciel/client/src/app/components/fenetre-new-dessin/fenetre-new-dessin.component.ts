import { Component, HostListener, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ChoixCouleurComponent } from 'src/app/components/choix-couleur/choix-couleur.component'
import { GestionnaireCouleursService, Portee} from 'src/app/services/couleur/gestionnaire-couleurs.service'
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

export const KEY_FORM_HAUTEUR = 'hauteurFormulaire';
export const KEY_FORM_LARGEUR = 'largeurFormulaire';
export const TAMPON_LARGEUR = 510;
export const TAMPON_HAUTEUR = 15;

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})

export class FenetreNewDessinComponent {
  hauteurFenetre = window.innerHeight - TAMPON_HAUTEUR;
  largeurFenetre = window.innerWidth - TAMPON_LARGEUR;
  dimChangeeManuellement = false;
  nouveauDessin = new FormGroup({
    hauteurFormulaire: new FormControl(this.hauteurFenetre),
    largeurFormulaire: new FormControl(this.largeurFenetre),
  });

  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>,
              public raccourcis: GestionnaireRaccourcisService,
              public serviceNouveauDessin: DessinManagerService,
              public router: Router,
              public stockageSVG: StockageSvgService,
              public gestionnaireCouleur: GestionnaireCouleursService,
              public dialog: MatDialog,
              public parametresCouleur: ParametresCouleurService,
              private ngZone: NgZone ) {
                this.dimmensionsChangees();
              }

  fermerFenetre() {
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
  }

  dimmensionChangeeManuellement() {
    this.dimChangeeManuellement = true;
  }

  @HostListener('window:resize', ['$event'])
  dimmensionsChangees() {
    if (!this.dimChangeeManuellement) {
      this.hauteurFenetre = window.innerHeight - TAMPON_HAUTEUR;
      this.largeurFenetre = window.innerWidth - TAMPON_LARGEUR;
      this.nouveauDessin.patchValue({hauteurFormulaire: this.hauteurFenetre, largeurFormulaire: this.largeurFenetre});
    }
  }

  validerNouveauDessin() {
    this.stockageSVG.viderDessin();
    this.serviceNouveauDessin.hauteur = this.nouveauDessin.value[KEY_FORM_HAUTEUR];
    this.serviceNouveauDessin.largeur = this.nouveauDessin.value[KEY_FORM_LARGEUR];
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
    this.ngZone.run(() => this.router.navigate(['dessin']));
  }

  selectionCouleur() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '25%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.dialog.open(ChoixCouleurComponent, dialogConfig).componentInstance.portee = Portee.Fond;
  }
}
