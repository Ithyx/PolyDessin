import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { CanvasConversionService } from 'src/app/services/canvas-conversion/canvas-conversion.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { LocalSaveManagerService } from 'src/app/services/saving/local/local-save-manager.service';
import { DatabaseService } from 'src/app/services/saving/remote/database.service';
import { SavingUtilityService } from 'src/app/services/saving/saving-utility.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { GalleryLoadWarningComponent } from '../gallery-load-warning/gallery-load-warning.component';

export enum Status {
  Loading = 0,
  Loaded = 1,
  Failed = 2
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  protected drawings: Drawing[];
  protected selected: number | null;
  protected status: Status;
  private dialogConfig: MatDialogConfig;
  private tagInput: FormControl;
  private searchTags: string[];

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private db: DatabaseService,
              private saveUtility: SavingUtilityService,
              private drawingManager: DrawingManagerService,
              private stockageSVG: SVGStockageService,
              private ngZone: NgZone,
              private router: Router,
              private dialog: MatDialog,
              private canvas: CanvasConversionService,
              private localSaving: LocalSaveManagerService) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '80%';
    this.selected = null;
    this.status = Status.Loading;
    this.tagInput = new FormControl();
    this.searchTags = [];
  }

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  async update(): Promise<void> {
    this.status = Status.Loading;
    try {
      this.drawings = await this.db.getData();
      this.status = Status.Loaded;
    } catch (err) {
      this.status = Status.Failed;
    }
  }

  async filter(): Promise<void> {
    this.status = Status.Loading;
    if (this.searchTags.indexOf(this.tagInput.value) === -1) { this.searchTags.push(this.tagInput.value); }
    try {
      this.drawings = await this.db.getDataWithTags(this.searchTags);
      this.status = Status.Loaded;
    } catch (err) {
      this.status = Status.Failed;
    }
  }

  async removeTag(tag: string): Promise<void> {
    this.status = Status.Loading;
    this.searchTags = this.searchTags.filter((value) => value !== tag);
    try {
      this.drawings = await this.db.getDataWithTags(this.searchTags);
      this.status = Status.Loaded;
    } catch (err) {
      this.status = Status.Failed;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  async openWarning(): Promise<boolean> {
    return !(await this.dialog.open(GalleryLoadWarningComponent, this.dialogConfig).afterClosed().toPromise());
  }

  async loadDrawing(drawing: Drawing): Promise<void> {
    if (this.stockageSVG.size !== 0 && await this.openWarning()) {
      return;
    }
    this.stockageSVG.cleanDrawing();
    this.drawingManager.id = drawing._id;
    this.drawingManager.height = drawing.height;
    this.drawingManager.width = drawing.width;
    this.drawingManager.backgroundColor = drawing.backgroundColor;
    this.drawingManager.name = drawing.name;
    if (drawing.tags) { this.drawingManager.tags = drawing.tags; } else { this.drawingManager.tags = []; }
    if (drawing.elements) {
      drawing.elements.forEach((element) => { this.stockageSVG.addSVG(this.saveUtility.createCopyDrawElement(element)); });
    }
    this.ngZone.run(() => this.router.navigate(['dessin']));
    this.canvas.updateDrawing();
    this.localSaving.saveState();
    this.close();
  }

  async deleteDrawing(drawing: Drawing): Promise<void> {
    await this.db.deleteDrawing(drawing._id);
    this.selected = null;
    await this.update();
  }
}
