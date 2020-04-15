import { TestBed } from '@angular/core/testing';

import { CanvasConversionService } from '../canvas-conversion.service';
import { EllipseService } from '../stockage-svg/draw-element/basic-shape/ellipse.service';
import { PolygonService } from '../stockage-svg/draw-element/basic-shape/polygon.service';
import { RectangleService } from '../stockage-svg/draw-element/basic-shape/rectangle.service';
import { LineService } from '../stockage-svg/draw-element/line.service';
import { SprayService } from '../stockage-svg/draw-element/spray.service';
import { TraceBrushService } from '../stockage-svg/draw-element/trace/trace-brush.service';
import { TracePencilService } from '../stockage-svg/draw-element/trace/trace-pencil.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { AddSVGService } from './add-svg.service';
import { Command } from './command';
import { CommandManagerService } from './command-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('CommandManagerService', () => {
  let service: CommandManagerService;
  let stockageService: SVGStockageService;
  let command: Command;
  let lastCommand: Command;
  let lastCancelledCommand: Command;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }}}]
  }));

  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    command = new AddSVGService([new LineService()], stockageService);
    service = TestBed.get(CommandManagerService);
  });

  beforeEach(() => {
    lastCancelledCommand = new AddSVGService([new EllipseService()], stockageService);
    service['cancelledCommands'].push(new AddSVGService([new PolygonService()], stockageService));
    service['cancelledCommands'].push(new AddSVGService([new RectangleService()], stockageService));
    service['cancelledCommands'].push(lastCancelledCommand);
  });

  beforeEach(() => {
    lastCommand = new AddSVGService([new SprayService()], stockageService);
    service['executedCommands'].push(new AddSVGService([new TracePencilService()], stockageService));
    service['executedCommands'].push(new AddSVGService([new TraceBrushService()], stockageService));
    service['executedCommands'].push(lastCommand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#constructor devrait mettre drawingInProgress à false', () => {
    expect(service.drawingInProgress).toBe(false);
  });

  // TESTS execute

  it('#execute devrait ajouter la commande dans executedCommands', () => {
    service.execute(command);
    expect(service['executedCommands']).toContain(command);
  });

  it('#execute devrait vider cancelledCommands', () => {
    service.execute(command);
    expect(service['cancelledCommands']).toEqual([]);
  });

  it('#execute devrait appeler updateDrawing de canvasConversion', () => {
    const spy = spyOn(service['canvasConversion'], 'updateDrawing');
    service.execute(command);
    expect(spy).toHaveBeenCalled();
  });

  it('#execute devrait appeler saveState de localSaving', () => {
    const spy = spyOn(service['localSaving'], 'saveState');
    service.execute(command);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS cancelCommand

  it('#cancelCommand devrait retirer la dernière commande de executedCommands', () => {
    service.cancelCommand();
    expect(service['executedCommands'].length).toBe(2);
  });

  it('#cancelCommand devrait appeler undo de la dernière commande si celle-ci existe', () => {
    spyOn(lastCommand, 'undo');
    service.cancelCommand();
    expect(lastCommand.undo).toHaveBeenCalled();
  });

  it('#cancelCommand devrait ajouter la dernière commande à cancelledCommands si celle-ci existe', () => {
    service.cancelCommand();
    expect(service['cancelledCommands']).toContain(lastCommand);
  });

  it('#cancelCommand devrait appeler updateDrawing de canvasConversion si la commande existe', () => {
    const spy = spyOn(service['canvasConversion'], 'updateDrawing');
    service.cancelCommand();
    expect(spy).toHaveBeenCalled();
  });

  it('#cancelCommand devrait appeler saveState de localSaving si la commande existe', () => {
    const spy = spyOn(service['localSaving'], 'saveState');
    service.cancelCommand();
    expect(spy).toHaveBeenCalled();
  });

  it('#cancelCommand devrait appeler deleteSelectionBox de selectionBox si la boite de sélection existe', () => {
    const spy = spyOn(service['selectionBox'], 'deleteSelectionBox');
    service['selectionBox'].box = new RectangleService();
    service.cancelCommand();
    expect(spy).toHaveBeenCalled();
  });

  it('#cancelCommand ne devrait pas appeler deleteSelectionBox de selectionBox si la boite de sélection n\'existe pas', () => {
    const spy = spyOn(service['selectionBox'], 'deleteSelectionBox');
    delete service['selectionBox'].box;
    service.cancelCommand();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#cancelCommand ne devrait rien faire si executedCommands est vide', () => {
    service['executedCommands'] = [];
    spyOn(service['cancelledCommands'], 'push');
    service.cancelCommand();
    expect(service['cancelledCommands'].push).not.toHaveBeenCalled();
  });

  // TESTS redoCommand

  it('#redoCommand devrait retirer la dernière commande de cancelledCommands', () => {
    service.redoCommand();
    expect(service['cancelledCommands'].length).toBe(2);
  });

  it('#redoCommand devrait appeler redo de la dernière commande si celle-ci existe', () => {
    spyOn(lastCancelledCommand, 'redo');
    service.redoCommand();
    expect(lastCancelledCommand.redo).toHaveBeenCalled();
  });

  it('#redoCommand devrait ajouter la dernière commande à executedCommands si celle-ci existe', () => {
    service.redoCommand();
    expect(service['executedCommands']).toContain(lastCancelledCommand);
  });

  it('#redoCommand devrait appeler updateDrawing de canvasConversion si la commande existe', () => {
    const spy = spyOn(service['canvasConversion'], 'updateDrawing');
    service.redoCommand();
    expect(spy).toHaveBeenCalled();
  });

  it('#redoCommand devrait appeler saveState de localSaving si la commande existe', () => {
    const spy = spyOn(service['localSaving'], 'saveState');
    service.redoCommand();
    expect(spy).toHaveBeenCalled();
  });

  it('#redoCommand ne devrait rien faire si cancelledCommands est vide', () => {
    service['cancelledCommands'] = [];
    spyOn(service['executedCommands'], 'push');
    service.redoCommand();
    expect(service['executedCommands'].push).not.toHaveBeenCalled();
  });

  // TESTS clearCommand

  it('#clearCommand devrait vider executedCommands', () => {
    service.clearCommand();
    expect(service['executedCommands']).toEqual([]);
  });

  it('#clearCommand devrait vider cancelledCommands', () => {
    service.clearCommand();
    expect(service['cancelledCommands']).toEqual([]);
  });

  it('#clearCommand devrait mettre drawingInProgress à false', () => {
    service.clearCommand();
    expect(service.drawingInProgress).toBe(false);
  });

  // TESTS hasExecutedCommands

  it('#hasExecutedCommands devrait retourner vrai si executedCommands n\'est pas vide', () => {
    expect(service.hasExecutedCommands()).toBe(true);
  });

  it('#hasExecutedCommands devrait retourner faux si executedCommands est vide', () => {
    service['executedCommands'] = [];
    expect(service.hasExecutedCommands()).toBe(false);
  });

  // TESTS hasCancelledCommands

  it('#hasCancelledCommands devrait retourner vrai si cancelledCommands n\'est pas vide', () => {
    expect(service.hasCancelledCommands()).toBe(true);
  });

  it('#hasCancelledCommands devrait retourner faux si cancelledCommands est vide', () => {
    service['cancelledCommands'] = [];
    expect(service.hasCancelledCommands()).toBe(false);
  });
});
