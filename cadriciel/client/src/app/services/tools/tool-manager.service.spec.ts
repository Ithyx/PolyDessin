import { TestBed } from '@angular/core/testing';

import {  LINE_TOOL_INDEX, TOOL_LIST, ToolManagerService } from './tool-manager.service';

describe('GestionnaireOutilsService', () => {
  let service: ToolManagerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ToolManagerService));

  it('should be created', () => {
    const testService: ToolManagerService = TestBed.get(ToolManagerService);
    expect(testService).toBeTruthy();
  });

  // TESTS trouverIndexParametre

  it('#trouverIndexParametre devrait retourner 0 si le parametre recherché n\'existe pas', () => {
    // L'outil initial du gestionnaire est le crayon
    expect(service.findParameterIndex('parametreTest')).toBe(0);
  });

  it('#trouverIndexParametre devrait renvoyer l\'index du parametre recherché', () => {
    service.activeTool = TOOL_LIST[LINE_TOOL_INDEX];
    expect(service.findParameterIndex('Type de jonction')).toBe(1);
  });

  // TESTS changerOutilActif

  it('#changerOutilActif ne devrait pas changer l\' outil actif si l\'index recherché est invalide', () => {
    service.changeActiveTool(99);
    // L'outil initial du gestionnaire est le crayon
    expect(service.activeTool.name).toBe('Crayon');
  });

  it('#changerOutilActif devrait changer d\' outil pour celui de l\'index spécifié', () => {
    service.changeActiveTool(LINE_TOOL_INDEX);
    expect(service.activeTool.name).toBe('Ligne');
  });

  it('#changerOutilActif devrait rendre actif le nouvel outil', () => {
    service.changeActiveTool(LINE_TOOL_INDEX);
    expect(service.activeTool.isActive).toBe(true);
  });

});
