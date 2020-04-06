import { Component, HostListener, NgZone } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { LocalSaveManagerService } from 'src/app/services/saving/local/local-save-manager.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  constructor(private dialog: MatDialog,
              private dialogConfig: MatDialogConfig,
              private localSaving: LocalSaveManagerService,
              private ngZone: NgZone,
              private router: Router) {
                dialogConfig.disableClose = true;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '60%'; }

  createDrawing(): void {
    this.dialog.open(NewDrawingWindowComponent, this.dialogConfig);
  }

  openGallery(): void {
    this.dialog.open(GalleryComponent, this.dialogConfig);
  }

  loadDrawing(): void {
    this.localSaving.loadState();
    this.ngZone.run(() => this.router.navigate(['dessin']));
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'o' && event.ctrlKey === true) {
      event.preventDefault();
      this.createDrawing();
    }
  }

}
