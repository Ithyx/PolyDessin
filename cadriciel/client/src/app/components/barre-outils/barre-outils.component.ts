import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { GestionnaireCouleursService, Portee } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';
import { AvertissementNouveauDessinComponent } from '../avertissement-nouveau-dessin/avertissement-nouveau-dessin.component';
import { ChoixCouleurComponent } from '../choix-couleur/choix-couleur.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnDestroy {

  porteePrincipale = Portee.Principale;
  porteeSecondaire = Portee.Secondaire;

  private nouveauDessinSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    public outils: GestionnaireOutilsService,
    public raccourcis: GestionnaireRaccourcisService,
    public gestionnaireCouleur: GestionnaireCouleursService
  ) {
    this.nouveauDessinSubscription = raccourcis.emitterNouveauDessin.subscribe((estIgnoree: boolean) => {
     if (!estIgnoree) { this.avertissementNouveauDessin(); };
    });
  }

  ngOnDestroy() {
    this.nouveauDessinSubscription.unsubscribe();
    this.raccourcis.emitterNouveauDessin.next(true);
  }

  onClick(outil: OutilDessin) {
    this.outils.outilActif.estActif = false;
    this.outils.outilActif = outil;
    this.outils.outilActif.estActif = true;
    this.raccourcis.viderSVGEnCours();
  }

  onChange(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (!isNaN(Number(eventCast.value))) {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].valeur = Math.max(Number(eventCast.value), 1);
    }
  }

  onSelect(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    if (typeof eventCast.value === 'string') {
      this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].optionChoisie = eventCast.value;
    }
  }

  onChampFocus() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  onChampBlur() {
    this.raccourcis.champDeTexteEstFocus = false;
  }

  avertissementNouveauDessin() {
    this.onChampFocus();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AvertissementNouveauDessinComponent, dialogConfig);
  }

  selectionCouleur(portee: Portee) {
    console.log('Couleur: ', this.gestionnaireCouleur.couleurs[portee]);
    this.gestionnaireCouleur.portee = portee;
    this.onChampFocus();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.dialog.open(ChoixCouleurComponent, dialogConfig);
  }
}
