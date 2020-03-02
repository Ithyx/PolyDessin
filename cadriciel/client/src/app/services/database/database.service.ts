import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing, NewDrawing } from '../../../../../common/communication/DrawingInterface';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';

const SERVER_POST_URL = 'http://localhost:3000/api/db/addNewDrawing';
const SERVER_PUT_URL = 'http://localhost:3000/api/db/updateDrawing';
const SERVER_GET_URL = 'http://localhost:3000/api/db/listDrawings';
// const HEADER = 'Content-Type: application/json';
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

  async updateDrawing(): Promise<void> {
    const currentDrawing: Drawing = {
      _id: this.drawingParams.id,
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: ['tag1', 'tag2'],
      elements: this.SVGSockage.getCompleteSVG()
    };
    await this.http.put<number>(SERVER_PUT_URL, currentDrawing).toPromise();
  }

  async sendNewDrawing(): Promise<void> {
    const currentDrawing: NewDrawing = {
      name: this.drawingParams.name,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.drawingParams.backgroundColor,
      tags: ['tag1', 'tag2'],
      elements: this.SVGSockage.getCompleteSVG()
    };
    this.drawingParams.id = await this.http.post<number>(SERVER_POST_URL, currentDrawing).toPromise();
  }

  async getData(): Promise<Drawing[]> {
    const list = await this.http.get<Drawing[]>(SERVER_GET_URL).toPromise();
    console.log(list);
    return list;
  }
}
