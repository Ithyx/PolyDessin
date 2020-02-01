import { Component, HostListener, OnInit } from '@angular/core';
import {  FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef} from '@angular/material';
import { Router } from '@angular/router';
import { DessinManagerService } from 'src/app/services/dessin-manager/dessin-manager.service';
import { StockageSvgService } from 'src/app/services/stockage-svg.service';

const INDEX_FORM_HAUTEUR = 'hauteurFormulaire';
const INDEX_FORM_LARGEUR = 'largeurFormulaire';
const INDEX_FORM_COULEUR = 'couleur';

@Component({
  selector: 'app-fenetre-new-dessin',
  templateUrl: './fenetre-new-dessin.component.html',
  styleUrls: ['./fenetre-new-dessin.component.scss']
})

export class FenetreNewDessinComponent implements OnInit {
  hauteurFenetre: number;
  largeurFenetre: number;
  nouveauDessin = new FormGroup({
    hauteurFormulaire: new FormControl(''),
    largeurFormulaire: new FormControl(''),
    couleur: new FormControl('#ffffff'),
  });

  constructor(public dialogRef: MatDialogRef<FenetreNewDessinComponent>,
              private serviceNouveauDessin: DessinManagerService,
              private router: Router,
              private stockageSVG: StockageSvgService) {}

  fermerFenetre() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.hauteurFenetre = window.innerHeight;
    this.largeurFenetre = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerLength: number; innerWidth: number; }; }) {
    this.hauteurFenetre = event.target.innerLength;
    this.largeurFenetre = event.target.innerWidth;
  }

  validerNouveauDessin() {
    this.stockageSVG.viderDessin();
    this.serviceNouveauDessin.hauteur = this.nouveauDessin.value[INDEX_FORM_HAUTEUR];
    this.serviceNouveauDessin.largeur = this.nouveauDessin.value[INDEX_FORM_LARGEUR];
    this.serviceNouveauDessin.couleur = this.nouveauDessin.value[INDEX_FORM_COULEUR];
    this.dialogRef.close();
    this.router.navigate(['dessin']);
  }
}
