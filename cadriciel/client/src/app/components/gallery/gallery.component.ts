import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database/database.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { Drawing } from '../../../../../common/communication/DrawingInterface';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  protected drawings: Drawing[];

  protected selected: number | null;

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private db: DatabaseService,
              private drawingManager: DrawingManagerService,
              private stockageSVG: SVGStockageService,
              private ngZone: NgZone,
              private router: Router) {
    this.selected = null;
  }

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  async update(): Promise<void> {
    this.drawings = await this.db.getData();
    console.log('finished updating');
  }

  close(): void {
    this.dialogRef.close();
  }

  addElement(element: DrawElement): void {
    this.stockageSVG.addSVG(element);
  }

  loadDrawing(drawing: Drawing): void {
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
    console.log('starting deletion');
    await this.db.deleteDrawing(drawing._id);
    await this.update();
    console.log('finished deleting');
  }
}
