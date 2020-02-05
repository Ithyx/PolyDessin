import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

const KEY_FORM_HAUTEUR = 'hauteurFormulaire';
const KEY_FORM_LARGEUR = 'largeurFormulaire';
const KEY_FORM_COULEUR = 'couleur';
const LARGEUR_BARRE_OUTILS = 410;

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})

export class FenetreNewDessinComponent {
  hauteurFenetre = window.innerHeight;
  largeurFenetre = window.innerWidth - LARGEUR_BARRE_OUTILS;
  dimChangeeManuellement = false;
  nouveauDessin = new FormGroup({
    hauteurFormulaire: new FormControl(this.hauteurFenetre),
    largeurFormulaire: new FormControl(this.largeurFenetre),
    couleur: new FormControl('#ffffff'),
  });

  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>,
              private serviceNouveauDessin: DessinManagerService,
              private router: Router,
              private stockageSVG: StockageSvgService) {
                this.dimmensionsChangees();
              }

  fermerFenetre() {
    this.dialogRef.close();
  }

  dimmensionChangeeManuellement() {
    this.dimChangeeManuellement = true;
  }

  @HostListener('window:resize', ['$event'])
  dimmensionsChangees() {
    if (!this.dimChangeeManuellement) {
      this.hauteurFenetre = window.innerHeight;
      this.largeurFenetre = window.innerWidth - LARGEUR_BARRE_OUTILS;
      this.nouveauDessin.patchValue({hauteurFormulaire: this.hauteurFenetre, largeurFormulaire: this.largeurFenetre});
    }
  }

  validerNouveauDessin() {
    this.stockageSVG.viderDessin();
    this.serviceNouveauDessin.hauteur = this.nouveauDessin.value[KEY_FORM_HAUTEUR];
    this.serviceNouveauDessin.largeur = this.nouveauDessin.value[KEY_FORM_LARGEUR];
    this.serviceNouveauDessin.couleur = this.nouveauDessin.value[KEY_FORM_COULEUR];
    this.dialogRef.close();
    this.router.navigate(['dessin']);
  }
}
