import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { Subscription } from 'rxjs';
import { ShortcutsManagerService } from 'src/app/services/shortcuts-manager.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ExportWindowComponent } from '../export-window/export-window.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { SavePopupComponent } from '../save-popup/save-popup.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnDestroy {

  private newDrawingSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private tools: ToolManagerService,
              private shortcuts: ShortcutsManagerService
             ) {
    this.newDrawingSubscription = shortcuts.newDrawingEmmiter.subscribe((isIgnored: boolean) => {
    if (!isIgnored) { this.warningNewDrawing(); }
    });
  }

  ngOnDestroy(): void {
    this.newDrawingSubscription.unsubscribe();
    this.shortcuts.newDrawingEmmiter.next(true);
  }

  onClick(tool: DrawingTool): void {
    this.tools.activeTool.isActive = false;
    this.tools.activeTool = tool;
    this.tools.activeTool.isActive = true;
    this.shortcuts.shortcutsFunctions.clearOngoingSVG();
  }

  disableShortcuts(): void {
    this.shortcuts.focusOnInput = true;
  }

  enableShortcuts(): void {
    this.shortcuts.focusOnInput = false;
  }

  warningNewDrawing(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(NewDrawingWarningComponent, dialogConfig);
  }

  openGallery(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    this.dialog.open(GalleryComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  openSavePopup(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(SavePopupComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  openExportWindow(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.dialog.open(ExportWindowComponent, dialogConfig).afterClosed().subscribe(this.enableShortcuts.bind(this));
  }

  openGridWindow(): void {
    this.disableShortcuts();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    this.dialog.open(GridOptionsComponent, dialogConfig);
  }
}
