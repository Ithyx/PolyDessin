import { Injectable } from '@angular/core';

import { AddSVGService } from './command/add-svg.service';
import { CommandManagerService } from './command/command-manager.service';
import { RemoveSVGService } from './command/remove-svg.service';
import { DrawingManagerService } from './drawing-manager/drawing-manager.service';
import { SavingUtilityService } from './saving/saving-utility.service';
import { DrawElement } from './stockage-svg/draw-element/draw-element';
import { SVGStockageService } from './stockage-svg/svg-stockage.service';
import { SelectionService } from './tools/selection/selection.service';

const PASTE_OFFSET = 20;

@Injectable({
  providedIn: 'root'
})

export class ClipboardService {

  private copiedElements: DrawElement[];
  private duplicatedElements: DrawElement[];
  private removeCommand: RemoveSVGService;
  private numberOfPaste: number;

  constructor(private selection: SelectionService,
              private commands: CommandManagerService,
              private svgStockage: SVGStockageService,
              private drawing: DrawingManagerService,
              private savingUtility: SavingUtilityService) {
                this.numberOfPaste = 0;
                this.copiedElements = [];
                this.duplicatedElements = [];
                this.removeCommand = new RemoveSVGService(this.svgStockage);
              }

  copySelectedElement(): void {
    this.copiedElements = [];
    this.numberOfPaste = 0;
    for (const element of this.selection.selectedElements) {
      this.copiedElements.push(this.savingUtility.createCopyDrawElement(element));
    }
  }

  cutSelectedElement(): void {
    this.copySelectedElement();
    this.deleteSelectedElement();
  }

  duplicateSelectedElement(): void {
    // copie
    this.duplicatedElements = [];
    for (const element of this.selection.selectedElements) {
      this.duplicatedElements.push(this.savingUtility.createCopyDrawElement(element));
    }

    // colle
    this.selection.deleteBoundingBox();
    for (const element of this.duplicatedElements) {
      element.updateTranslation(PASTE_OFFSET, PASTE_OFFSET);
    }

    if (this.isInDrawing(this.duplicatedElements)) {
      for (const element of this.duplicatedElements) {
        this.selection.selectedElements.push(element);
      }
    } else {
      for (const element of this.duplicatedElements) {
        element.updateTranslation(-PASTE_OFFSET, -PASTE_OFFSET);
        this.selection.selectedElements.push(element);
      }
    }

    this.commands.execute(new AddSVGService(this.duplicatedElements, this.svgStockage));

    this.selection.createBoundingBox();
  }

  deleteSelectedElement(): void {
    this.removeCommand = new RemoveSVGService(this.svgStockage);
    this.removeCommand.addElements(this.selection.selectedElements);
    this.selection.deleteBoundingBox();
    this.commands.execute(this.removeCommand);
  }

  pasteSelectedElement(): void {
    this.selection.deleteBoundingBox();
    const buffer: DrawElement[] = [];
    for (const element of this.copiedElements) {
      element.updateTranslation(PASTE_OFFSET, PASTE_OFFSET);
    }

    if (this.isInDrawing(this.copiedElements)) {
      for (const element of this.copiedElements) {
        this.selection.selectedElements.push(element);
        buffer.push(this.savingUtility.createCopyDrawElement(element));
      }
    } else {
      for (const element of this.copiedElements) {
        element.updateTranslation(-PASTE_OFFSET * this.numberOfPaste, -PASTE_OFFSET * this.numberOfPaste);
        this.selection.selectedElements.push(element);
        buffer.push(this.savingUtility.createCopyDrawElement(element));
        this.numberOfPaste = 0;
      }
    }

    this.commands.execute(new AddSVGService(this.copiedElements, this.svgStockage));

    this.copiedElements = buffer;

    this.selection.createBoundingBox();
    this.numberOfPaste++;
  }

  isInDrawing(elements: DrawElement[]): boolean {
    let allElementAreVisible = true;
    for (const element of elements) {
      this.selection.findPointMinAndMax(element);
      const elementIsVisible = element.pointMax.x < this.drawing.width && element.pointMax.y < this.drawing.height;

      allElementAreVisible = allElementAreVisible && elementIsVisible;
    }
    return allElementAreVisible;
  }

  ongoingSelection(): boolean {
    return this.selection.selectedElements.length !== 0;
  }

  canPaste(): boolean {
    return this.copiedElements.length !== 0;
  }
}
