import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GestionnaireRaccourcisService } from 'src/app/services/shortcuts-manager.service';
import { GridService, MAX_CELL_SIZE, MIN_CELL_SIZE } from 'src/app/services/grid/grid.service';
import { FenetreNouveauDessinComponent } from '../fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';

export const KEY_FORM_SHOW_GRID = 'showGridForm';
export const KEY_FORM_OPACITY = 'opacityForm';
export const KEY_FORM_CELL_SIZE = 'cellSizeForm';

@Component({
  selector: 'app-grid-options',
  templateUrl: './grid-options.component.html',
  styleUrls: ['./grid-options.component.scss']
})
export class GridOptionsComponent {
  cellSizeValue = this.grid.cellSize;
  opacitySelected = Math.round(100 * this.grid.opacity);
  options = new FormGroup({
    showGridForm: new FormControl(this.grid.showGrid),
    opacityForm: new FormControl(this.grid.opacity),
    cellSizeForm: new FormControl(this.grid.cellSize)
  });

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<FenetreNouveauDessinComponent>,
              public raccourcis: GestionnaireRaccourcisService,
              public grid: GridService) { }

  closeWindow() {
    this.raccourcis.champDeTexteEstFocus = false;
    this.dialogRef.close();
  }

  confirmOptions() {
    this.grid.opacity = this.options.value[KEY_FORM_OPACITY];
    this.grid.showGrid = this.options.value[KEY_FORM_SHOW_GRID];
    this.grid.cellSize = this.options.value[KEY_FORM_CELL_SIZE];
    this.closeWindow();
  }

  changeOpacity(event: Event) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.opacitySelected = Math.round(100 * Number(eventCast.value));
  }

  validateCellSize(event: Event) {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.cellSizeValue = Math.max(Math.min(Number(eventCast.value), MAX_CELL_SIZE), MIN_CELL_SIZE);
    this.options.value[KEY_FORM_CELL_SIZE] = this.cellSizeValue;
  }

}
