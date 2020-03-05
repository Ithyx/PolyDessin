import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(public dialog: MatDialog,
              public drawingManager: DrawingManagerService,
              public dialogConfig: MatDialogConfig) {
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '60%'; }

  createDrawing(): void {
    this.dialog.open(NewDrawingWindowComponent, this.dialogConfig);
  }

  openGallery(): void {
    this.dialog.open(GalleryComponent, this.dialogConfig);
  }

}
