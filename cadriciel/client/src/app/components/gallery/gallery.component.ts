import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { Drawing } from '../../../../../common/communication/DrawingInterface';
import { GalleryLoadWarningComponent } from '../gallery-load-warning/gallery-load-warning.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  protected drawings: Drawing[];
  protected selected: number | null;
  protected isLoading: boolean;
  private dialogConfig: MatDialogConfig;
  private tagInput: FormControl;
  private searchTags: string[];

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private db: DatabaseService,
              private drawingManager: DrawingManagerService,
              private stockageSVG: SVGStockageService,
              private ngZone: NgZone,
              private router: Router,
              private dialog: MatDialog) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '80%';
    this.selected = null;
    this.isLoading = false;
    this.tagInput = new FormControl();
    this.searchTags = [];
  }

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  async update(): Promise<void> {
    this.isLoading = true;
    this.drawings = await this.db.getData();
    this.isLoading = false;
  }

  async filter(): Promise<void> {
    if (this.searchTags.indexOf(this.tagInput.value) === -1) { this.searchTags.push(this.tagInput.value); }
    this.isLoading = true;
    this.drawings = await this.db.getDataWithTags(this.searchTags);
    this.isLoading = false;
  }

  async removeTag(tag: string): Promise<void> {
    this.searchTags = this.searchTags.filter((value) => value !== tag);
    this.isLoading = true;
    this.drawings = await this.db.getDataWithTags(this.searchTags);
    this.isLoading = false;
  }

  close(): void {
    this.dialogRef.close();
  }

  addElement(element: DrawElement): void {
    this.stockageSVG.addSVG(element);
  }

  async loadDrawing(drawing: Drawing): Promise<void> {
    if (this.stockageSVG.size !== 0) {
      if (!(await this.dialog.open(GalleryLoadWarningComponent, this.dialogConfig).afterClosed().toPromise())) { return; }
    }
    this.stockageSVG.cleanDrawing();
    this.drawingManager.id = drawing._id;
    this.drawingManager.height = drawing.height;
    this.drawingManager.width = drawing.width;
    this.drawingManager.backgroundColor = drawing.backgroundColor;
    this.drawingManager.name = drawing.name;
    if (drawing.tags) { this.drawingManager.tags = drawing.tags; }
    if (drawing.elements) { drawing.elements.forEach(this.addElement.bind(this)); }
    this.ngZone.run(() => this.router.navigate(['dessin']));
    this.close();
  }

  async deleteDrawing(drawing: Drawing): Promise<void> {
    await this.db.deleteDrawing(drawing._id);
    this.selected = null;
    await this.update();
  }
}
