import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../../common/communication/drawing-interface';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';

export enum SERVER_URL {
  POST = 'http://localhost:3000/api/db/saveDrawing',
  GET = 'http://localhost:3000/api/db/listDrawings',
  DELETE = 'http://localhost:3000/api/db/deleteDrawing'
}
const ID_MAX = 1000000000;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient,
              private stockageSVG: SVGStockageService,
              private drawingParams: DrawingManagerService) {}

  async saveDrawing(): Promise<void> {
    if (this.drawingParams.id === 0) { this.drawingParams.id = Math.floor(Math.random() * ID_MAX); }
    const drawing: Drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: this.drawingParams.tags,
      elements: this.stockageSVG.getCompleteSVG()
    };
    await this.http.post(SERVER_URL.POST, drawing).toPromise();
  }

  async getData(): Promise<Drawing[]> {
    return await this.http.get<Drawing[]>(SERVER_URL.GET).toPromise();
  }

  async getDataWithTags(tags: string[]): Promise<Drawing[]> {
    let URL: string = SERVER_URL.GET;
    if (tags.length !== 0) {
      URL += '?tags=' + encodeURIComponent(JSON.stringify(tags));
    }
    return await this.http.get<Drawing[]>(URL).toPromise();
  }

  async deleteDrawing(id: number): Promise<void> {
    await this.http.delete(SERVER_URL.DELETE + '?id=' + id.toString()).toPromise();
  }

  async sendEmail(emailAddress: string): Promise<void> {
    //
  }
}
