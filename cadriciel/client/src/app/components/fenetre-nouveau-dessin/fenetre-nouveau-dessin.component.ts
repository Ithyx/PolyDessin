import { Component, HostListener, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { ChoixCouleurComponent } from 'src/app/components/choix-couleur/choix-couleur.component'
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { ColorManagerService, Scope } from 'src/app/services/couleur/color-manager.service'
import { ColorParameterService } from 'src/app/services/couleur/color-parameter.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

export const KEY_FORM_HAUTEUR = 'hauteurFormulaire';
export const KEY_FORM_LARGEUR = 'largeurFormulaire';
export const TAMPON_LARGEUR = 510;
export const TAMPON_HAUTEUR = 15;

@Component({
  selector: 'app-fenetre-nouveau-dessin',
  templateUrl: './fenetre-nouveau-dessin.component.html',
  styleUrls: ['./fenetre-nouveau-dessin.component.scss']
})

export class FenetreNouveauDessinComponent {
  hauteurFenetre = window.innerHeight - TAMPON_HAUTEUR;
  largeurFenetre = window.innerWidth - TAMPON_LARGEUR;
  dimChangeeManuellement = false;
  nouveauDessin = new FormGroup({
    hauteurFormulaire: new FormControl(this.hauteurFenetre),
    largeurFormulaire: new FormControl(this.largeurFenetre),
  });

  constructor(public dialogRef: MatDialogRef<FenetreNouveauDessinComponent>,
              public raccourcis: GestionnaireRaccourcisService,
              public drawingManager: DrawingManagerService,
              public router: Router,
              public SVGStockage: SVGStockageService,
              public gestionnaireCouleur: ColorManagerService,
              public dialog: MatDialog,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
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
    this.SVGStockage.cleanDrawing();
    this.commands.clearCommand();
    this.drawingManager.height = this.nouveauDessin.value[KEY_FORM_HAUTEUR];
    this.drawingManager.width = this.nouveauDessin.value[KEY_FORM_LARGEUR];
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
    this.ngZone.run(() => this.router.navigate(['dessin']));
  }

  selectionCouleur() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.dialog.open(ChoixCouleurComponent, dialogConfig).componentInstance.portee = Scope.Background;
  }
}
