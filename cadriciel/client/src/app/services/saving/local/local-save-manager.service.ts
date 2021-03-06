import { Injectable } from '@angular/core';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { DrawElement } from '../../stockage-svg/draw-element/draw-element';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { SavingUtilityService } from '../saving-utility.service';

export const PARAMETERS_KEY = 'currentDrawingParameters';
export const CONTENT_KEY = 'currentDrawingContent';

@Injectable({
  providedIn: 'root'
})
export class LocalSaveManagerService {

  constructor(private currentDrawingParams: DrawingManagerService,
              private currentDrawingContent: SVGStockageService,
              private savingUtility: SavingUtilityService,
              private svgStockage: SVGStockageService) { }

  isStorageEmpty(): boolean {
    return localStorage.length === 0;
  }

  saveState(): void {
    localStorage.setItem(PARAMETERS_KEY, JSON.stringify(this.currentDrawingParams));
    localStorage.setItem(CONTENT_KEY, JSON.stringify(this.currentDrawingContent.getCompleteSVG()));
  }

  loadState(): boolean {
    const paramsCopy = localStorage.getItem(PARAMETERS_KEY);
    const contentCopy = localStorage.getItem(CONTENT_KEY);
    if (paramsCopy === null || contentCopy === null) {
      localStorage.clear(); // on s'assure que nos données sont effacées si elles sont corrumpues
      return false;
    }

    const parsedParams = (JSON.parse(paramsCopy) as DrawingManagerService);
    const parsedContent = (JSON.parse(contentCopy) as DrawElement[]);

    this.currentDrawingParams.id = parsedParams.id;
    this.currentDrawingParams.height = parsedParams.height;
    this.currentDrawingParams.width = parsedParams.width;
    this.currentDrawingParams.backgroundColor = parsedParams.backgroundColor;
    // le nom est ignoré
    this.currentDrawingParams.name = '';
    // les étiquettes sont ignorées
    this.currentDrawingParams.tags = [];

    this.currentDrawingContent.cleanDrawing();
    for (const element of parsedContent) {
      this.svgStockage.addSVG(this.savingUtility.createCopyDrawElement(element));
    }

    return true;
  }
}
