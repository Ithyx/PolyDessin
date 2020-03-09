import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/DrawingInterface';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';

const SERVER_POST_URL = 'http://localhost:3000/api/db/saveDrawing';
const SERVER_GET_URL = 'http://localhost:3000/api/db/listDrawings';
const SERVER_DELETE_URL = 'http://localhost:3000/api/db/deleteDrawing';
const headers: HttpHeaders = new HttpHeaders();

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient,
              private SVGSockage: SVGStockageService,
              private drawingParams: DrawingManagerService) {
    headers.set('content-type', 'application/json');
  }

  async saveDrawing(): Promise<void> {
    if (this.drawingParams.id === 0) { this.drawingParams.id = Math.floor(Math.random() * 1000000000); }
    const drawing: Drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: this.drawingParams.tags,
      elements: this.SVGSockage.getCompleteSVG()
    };
    await this.http.post(SERVER_POST_URL, drawing).toPromise();
  }

  async getData(): Promise<Drawing[]> {
    return await this.http.get<Drawing[]>(SERVER_GET_URL).toPromise();
  }

  async getDataWithTags(tags: string[]): Promise<Drawing[]> {
    return await this.http.get<Drawing[]>(SERVER_GET_URL + '?tags=' + encodeURIComponent(JSON.stringify(tags))).toPromise();
  }

  async deleteDrawing(id: number): Promise<void> {
    await this.http.delete(SERVER_DELETE_URL + '?id=' + id.toString()).toPromise();
  }
}
