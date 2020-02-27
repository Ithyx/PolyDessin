import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { Scope } from 'src/app/services/color/color-manager.service';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { CommandManagerService } from 'src/app/services/command/command-manager.service';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';

@Component({
  selector: 'app-barre-outils',
  templateUrl: './barre-outils.component.html',
  styleUrls: ['./barre-outils.component.scss']
})
export class BarreOutilsComponent implements OnDestroy {

  porteePrincipale = Scope.Primary;
  porteeSecondaire = Scope.Secondary;
  fenetreDessin: ColorChoiceComponent;

  private nouveauDessinSubscription: Subscription;

  constructor(public dialog: MatDialog,
              public tools: ToolManagerService,
              public shortcuts: ShortcutsManagerService,
              public colorParameter: ColorParameterService,
              public commands: CommandManagerService,
              public selection: SelectionService
             ) {
    this.nouveauDessinSubscription = shortcuts.newDrawingEmmiter.subscribe((estIgnoree: boolean) => {
     if (!estIgnoree) { this.avertissementNouveauDessin(); };
    });
  }

  ngOnDestroy() {
    this.nouveauDessinSubscription.unsubscribe();
    this.shortcuts.newDrawingEmmiter.next(true);
  }

  clic(outil: DrawingTool) {
    if (this.tools.activeTool.name === 'Selection' && this.selection.selectionBox) {
      this.selection.deleteBoundingBox();
  }
    this.tools.activeTool.isActive = false;
    this.tools.activeTool = outil;
    this.tools.activeTool.isActive = true;
    this.shortcuts.clearOngoingSVG();
  }

  onChange(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(nomParametre)].value = Math.max(Number(eventCast.value), 1);
  }

  choixSelectionne(event: Event, nomParametre: string) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.tools.activeTool.parameters[this.tools.findParameterIndex(nomParametre)].choosenOption = eventCast.value;
  }

  desactiverRaccourcis() {
    this.shortcuts.focusOnInput = true;
  }

  activerRaccourcis() {
    this.shortcuts.focusOnInput = false;
  }

  avertissementNouveauDessin() {

    this.desactiverRaccourcis();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(NewDrawingWarningComponent, dialogConfig);
  }

  selectionCouleur(porteeEntree: string) {
    this.desactiverRaccourcis();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.panelClass = 'fenetre-couleur';
    this.fenetreDessin = this.dialog.open(ColorChoiceComponent, dialogConfig).componentInstance;
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
