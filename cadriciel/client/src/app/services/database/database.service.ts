import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '../../../../../common/communication/DrawingInterface';
import { ColorParameterService } from '../color/color-parameter.service';
import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';

const SERVER_POST_URL = 'http://localhost:3000/api/db/addNewDrawing';
const SERVER_GET_URL = 'http://localhost:3000/api/db/listDrawings';
// const HEADER = 'Content-Type: application/json';
const headers: HttpHeaders = new HttpHeaders();

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient,
              private SVGSockage: SVGStockageService,
              private drawingParams: DrawingManagerService,
              private colorParams: ColorParameterService) {
    headers.set('content-type', 'application/json');
  }

  async sendNewDrawing(newName: string): Promise<number> {
    const currentDrawing: Drawing = {
      name: newName,
      height: this.drawingParams.height,
      width: this.drawingParams.width,
      backgroundColor: this.colorParams.backgroundColor,
      tags: ['tag1', 'tag2'],
      elements: this.SVGSockage.getCompleteSVG()
    };
    console.log('sending data: ', JSON.stringify(currentDrawing));
    return await this.http.post<number>(SERVER_POST_URL, currentDrawing).toPromise();
  }

  async getData(): Promise<Drawing[]> {
    const list = await this.http.get<Drawing[]>(SERVER_GET_URL).toPromise();
    console.log(list);
    return list;
  }
}
