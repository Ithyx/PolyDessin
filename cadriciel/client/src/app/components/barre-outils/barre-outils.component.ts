import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { Scope} from 'src/app/services/couleur/color-manager.service';
import { ColorParameterService } from 'src/app/services/couleur/color-parameter.service';
import { GestionnaireRaccourcisService } from 'src/app/services/gestionnaire-raccourcis.service';
import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { AvertissementNouveauDessinComponent } from '../avertissement-nouveau-dessin/avertissement-nouveau-dessin.component';
import { ChoixCouleurComponent } from '../choix-couleur/choix-couleur.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnDestroy {

  porteePrincipale = Scope.Primary;
  porteeSecondaire = Scope.Secondary;
  fenetreDessin: ChoixCouleurComponent;

  private nouveauDessinSubscription: Subscription;

  constructor(public dialog: MatDialog,
              public outils: GestionnaireOutilsService,
              public raccourcis: GestionnaireRaccourcisService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              public selection: SelectionService
             ) {
    this.nouveauDessinSubscription = raccourcis.emitterNouveauDessin.subscribe((estIgnoree: boolean) => {
     if (!estIgnoree) { this.avertissementNouveauDessin(); };
    });
  }

  ngOnDestroy() {
    this.nouveauDessinSubscription.unsubscribe();
    this.raccourcis.emitterNouveauDessin.next(true);
  }

  clic(outil: OutilDessin) {
    if (this.outils.outilActif.nom === 'Selection' && this.selection.selectionBox) {
      this.selection.deleteBoundingBox();
  }
    this.outils.outilActif.estActif = false;
    this.outils.outilActif = outil;
    this.outils.outilActif.estActif = true;
    this.raccourcis.viderSVGEnCours();
  }

  onChange(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].valeur = Math.max(Number(eventCast.value), 1);
  }

  choixSelectionne(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.outils.outilActif.parametres[this.outils.trouverIndexParametre(nomParametre)].optionChoisie = eventCast.value;
  }

  desactiverRaccourcis() {
    this.raccourcis.champDeTexteEstFocus = true;
  }

  activerRaccourcis() {
    this.raccourcis.champDeTexteEstFocus = false;
  }

  avertissementNouveauDessin() {

    this.desactiverRaccourcis();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(AvertissementNouveauDessinComponent, dialogConfig);
  }

  selectionCouleur(porteeEntree: string) {
    this.desactiverRaccourcis();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.fenetreDessin = this.dialog.open(ChoixCouleurComponent, dialogConfig).componentInstance;
    if (porteeEntree === 'principale') {
      this.fenetreDessin.portee = Scope.Primary;
    }
    if (porteeEntree === 'secondaire') {
      this.fenetreDessin.portee = Scope.Secondary;
    }
    if (porteeEntree === 'fond') {
      this.fenetreDessin.portee = Scope.Background;
    }
  }

  openGridWindow() {
    this.desactiverRaccourcis();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(GridOptionsComponent, dialogConfig);
  }

  selectionDerniereCouleurPrimaire(couleurChoisie: string) {
    this.colorParameter.primaryColor = couleurChoisie;
  }

  selectionDerniereCouleurSecondaire(couleurChoisie: string, evenement: MouseEvent) {
    this.colorParameter.secondaryColor = couleurChoisie;
    evenement.preventDefault();
  }

  appliquerOpacitePrincipale(evenement: Event) {
    const evenementCast: HTMLInputElement = (evenement.target as HTMLInputElement);
    this.colorParameter.primaryOpacity = Math.max(Math.min(Number(evenementCast.value), 1), 0);
    this.colorParameter.primaryOpacityDisplayed = Math.round(100 * this.colorParameter.primaryOpacity);
  }

  appliquerOpaciteSecondaire(evenement: Event) {
    const evenementCast: HTMLInputElement = (evenement.target as HTMLInputElement);
    this.colorParameter.secondaryOpacity = Math.max(Math.min(Number(evenementCast.value), 1), 0);
    this.colorParameter.secondaryOpacityDisplayed = Math.round(100 * this.colorParameter.secondaryOpacity);
  }
}
