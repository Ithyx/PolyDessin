import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DatabaseService } from 'src/app/services/database/database.service';
import { Drawing } from '../../../../../common/communication/DrawingInterface';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  protected drawings: Drawing[];

  constructor(private dialogRef: MatDialogRef<GalleryComponent>,
              private db: DatabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  async update(): Promise<void> {
    this.drawings = await this.db.getData();
  }

  close(): void {
    this.dialogRef.close();
  }
}
