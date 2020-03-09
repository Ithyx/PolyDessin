import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-gallery-load-warning',
  templateUrl: './gallery-load-warning.component.html',
  styleUrls: ['./gallery-load-warning.component.scss']
})
export class GalleryLoadWarningComponent {

  constructor(private dialogRef: MatDialogRef<GalleryLoadWarningComponent>) {  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
