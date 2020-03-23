import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private dialog: MatDialog,
              // private drawingManager: DrawingManagerService,
              private dialogConfig: MatDialogConfig
              ) {
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '60%'; }

  createDrawing(): void {
    this.dialog.open(NewDrawingWindowComponent, this.dialogConfig);
  }

  openGallery(): void {
    this.dialog.open(GalleryComponent, this.dialogConfig);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'o' && event.ctrlKey === true) {
      event.preventDefault();
      this.createDrawing();
    }
  }

}
