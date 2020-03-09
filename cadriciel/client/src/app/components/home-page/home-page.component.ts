import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'o' && event.ctrlKey === true) {
      this.createDrawing();
      event.preventDefault();
    }
  }

}
