import { TestBed } from '@angular/core/testing';

import { EllipseService } from '../stockage-svg/ellipse.service';
import { LineService } from '../stockage-svg/line.service';
import { PolygonService } from '../stockage-svg/polygon.service';
import { RectangleService } from '../stockage-svg/rectangle.service';
import { SVGStockageService } from '../stockage-svg/svg-stockage.service';
import { TraceBrushService } from '../stockage-svg/trace-brush.service';
import { TracePencilService } from '../stockage-svg/trace-pencil.service';
import { TraceSprayService } from '../stockage-svg/trace-spray.service';
import { AddSVGService } from './add-svg.service';
import { Command } from './command';
import { CommandManagerService } from './command-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('GestionnaireCommandesService', () => {
  let service: CommandManagerService;
  let stockageService: SVGStockageService;
  let command: Command;
  let lastCommand: Command;
  let lastCancelledCommand: Command;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    stockageService = TestBed.get(SVGStockageService);
    command = new AddSVGService(new LineService(), stockageService);
    service = TestBed.get(CommandManagerService);
  });

  beforeEach(() => {
    lastCancelledCommand = new AddSVGService(new EllipseService(), stockageService);
    service.cancelledCommands.push(new AddSVGService(new PolygonService(), stockageService));
    service.cancelledCommands.push(new AddSVGService(new RectangleService(), stockageService));
    service.cancelledCommands.push(lastCancelledCommand);
  });

  beforeEach(() => {
    lastCommand = new AddSVGService(new TraceSprayService(), stockageService);
    service.executedCommands.push(new AddSVGService(new TracePencilService(), stockageService));
    service.executedCommands.push(new AddSVGService(new TraceBrushService(), stockageService));
    service.executedCommands.push(lastCommand);
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
    expect(service.executedCommands).toContain(command);
  });

  it('#execute devrait vider cancelledCommands', () => {
    service.execute(command);
    expect(service.cancelledCommands).toEqual([]);
  });

  // TESTS cancelCommand

  it('#cancelCommand devrait retirer la dernière commande de executedCommands', () => {
    service.cancelCommand();
    expect(service.executedCommands.length).toBe(2);
  });

  it('#cancelCommand devrait appeler undo de la dernière commande si celle-ci existe', () => {
    spyOn(lastCommand, 'undo');
    service.cancelCommand();
    expect(lastCommand.undo).toHaveBeenCalled();
  });

  it('#cancelCommand devrait ajouter la dernière commande à cancelledCommands si celle-ci existe', () => {
    service.cancelCommand();
    expect(service.cancelledCommands).toContain(lastCommand);
  });

  it('#cancelCommand ne devrait rien faire si executedCommands est vide', () => {
    service.executedCommands = [];
    spyOn(service.cancelledCommands, 'push');
    service.cancelCommand();
    expect(service.cancelledCommands.push).not.toHaveBeenCalled();
  });

  // TESTS redoCommand

  it('#redoCommand devrait retirer la dernière commande de cancelledCommands', () => {
    service.redoCommand();
    expect(service.cancelledCommands.length).toBe(2);
  });

  it('#redoCommand devrait appeler redo de la dernière commande si celle-ci existe', () => {
    spyOn(lastCancelledCommand, 'redo');
    service.redoCommand();
    expect(lastCancelledCommand.redo).toHaveBeenCalled();
  });

  it('#redoCommand devrait ajouter la dernière commande à executedCommands si celle-ci existe', () => {
    service.redoCommand();
    expect(service.executedCommands).toContain(lastCancelledCommand);
  });

  it('#redoCommand ne devrait rien faire si cancelledCommands est vide', () => {
    service.cancelledCommands = [];
    spyOn(service.executedCommands, 'push');
    service.redoCommand();
    expect(service.executedCommands.push).not.toHaveBeenCalled();
  });

  // TESTS clearCommand

  it('#clearCommand devrait vider executedCommands', () => {
    service.clearCommand();
    expect(service.executedCommands).toEqual([]);
  });

  it('#clearCommand devrait vider cancelledCommands', () => {
    service.clearCommand();
    expect(service.cancelledCommands).toEqual([]);
  });

  it('#clearCommand devrait mettre drawingInProgress à false', () => {
    service.clearCommand();
    expect(service.drawingInProgress).toBe(false);
  });
});
