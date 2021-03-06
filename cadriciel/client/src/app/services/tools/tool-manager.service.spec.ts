import { TestBed } from '@angular/core/testing';
import { TOOL_INDEX, TOOL_LIST, ToolManagerService } from './tool-manager.service';

// tslint:disable: no-magic-numbers

describe('ToolManagerService', () => {
  let service: ToolManagerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ToolManagerService));

  it('should be created', () => {
    const testService: ToolManagerService = TestBed.get(ToolManagerService);
    expect(testService).toBeTruthy();
  });

  // TESTS findParameterIndex

  it('#findParameterIndex devrait retourner 0 si le parametre recherché n\'existe pas', () => {
    // L'outil initial du gestionnaire est le crayon
    expect(service.findParameterIndex('parametreTest')).toBe(0);
  });

  it('#findParameterIndex devrait renvoyer l\'index du parametre recherché', () => {
    service.activeTool = TOOL_LIST[TOOL_INDEX.LINE];
    expect(service.findParameterIndex('Type de jonction')).toBe(1);
  });

  // TESTS changeActiveTool

  it('#changeActiveTool ne devrait pas changer l\' outil actif si l\'index recherché est invalide', () => {
    service.changeActiveTool(99);
    // L'outil initial du gestionnaire est le crayon
    expect(service.activeTool.name).toBe('Crayon');
  });

  it('#changeActiveTool devrait changer d\' outil pour celui de l\'index spécifié', () => {
    service.changeActiveTool(TOOL_INDEX.LINE);
    expect(service.activeTool.name).toBe('Ligne');
  });

  it('#changeActiveTool devrait rendre actif le nouvel outil', () => {
    service.changeActiveTool(TOOL_INDEX.LINE);
    expect(service.activeTool.isActive).toBe(true);
  });

});
