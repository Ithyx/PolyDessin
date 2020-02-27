import { TestBed } from '@angular/core/testing';
import { ShortcutsManagerService } from './shortcuts-manager.service';
import { LINE_TOOL_INDEX, RECTANGLE_TOOL_INDEX } from './tools/tool-manager.service';

describe('GestionnaireRaccourcisService', () => {
  let service: ShortcutsManagerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ShortcutsManagerService));

  it('should be created', () => {
    const testService: ShortcutsManagerService = TestBed.get(ShortcutsManagerService);
    expect(testService).toBeTruthy();
  });

  // TESTS viderSVGECcours

  it('#clearOngoingSVG devrait vider le SVGEnCours de l\' outil rectange', () => {
    spyOn(service.rectangleTool, 'clear')
    service.clearOngoingSVG();
    expect(service.rectangleTool.clear).toHaveBeenCalled();
  });

  it('#clearOngoingSVG devrait vider le SVGEnCours de l\' outil ligne', () => {
    spyOn(service.lineTool, 'clear')
    service.clearOngoingSVG();
    expect(service.lineTool.clear).toHaveBeenCalled();
  });

  // TESTS treatInput

  it('#treatInput ne fait rien si le focus est sur un champ de texte', () => {
    const clavier = new KeyboardEvent('keypress', { key: '1'});
    service.focusOnInput = true;

    spyOn(service, 'clearOngoingSVG');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).not.toHaveBeenCalled();         // On ne devrait pas vider le SVG en cours
    expect(service.tools.activeTool.name).not.toBe('Rectangle');    // On ne devrait pas changer d'outil actif
  });

  it('#treatInput ne fait rien si la touche n\'est pas programmée', () => {
    const clavier = new KeyboardEvent('keypress');

    // Liste des opérations possible par treatInput
    spyOn(service, 'clearOngoingSVG');
    spyOn(service.tools, 'changeActiveTool');
    spyOn(service.lineTool, 'stockerCurseur');
    spyOn(service.lineTool, 'retirerPoint');
    spyOn(service.lineTool, 'clear');
    spyOn(service.rectangleTool, 'shiftPress');
    spyOn(clavier, 'preventDefault');
    spyOn(service.newDrawingEmmiter, 'next');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).not.toHaveBeenCalled();
    expect(service.tools.changeActiveTool).not.toHaveBeenCalled();
    expect(service.lineTool.stockerCurseur).not.toHaveBeenCalled();
    expect(service.lineTool.retirerPoint).not.toHaveBeenCalled();
    expect(service.lineTool.clear).not.toHaveBeenCalled();
    expect(service.rectangleTool.shiftPress).not.toHaveBeenCalled();
    expect(clavier.preventDefault).not.toHaveBeenCalled();
    expect(service.newDrawingEmmiter.next).not.toHaveBeenCalled();
  });

  it('#treatInput devrait mettre rectangle comme outil actif si il reçoit 1', () => {
    const clavier = new KeyboardEvent('keypress', { key: '1'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Rectangle');
  });

  it('#treatInput devrait mettre crayon comme outil actif si il reçoit c', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'c'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Crayon');
  });

  it('#treatInput devrait mettre ligne comme outil actif si il reçoit l', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'l'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Ligne');
  });

  it('#treatInput devrait mettre pinceau comme outil actif si il reçoit w', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'w'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(clavier);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Pinceau');
  });

  it('#treatInput devrait retirer le dernier point en cours si il reçoit Backspace et que ligne est active', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Backspace'});
    service.tools.changeActiveTool(LINE_TOOL_INDEX);
    spyOn(service.lineTool, 'retirerPoint');

    service.treatInput(clavier);

    expect(service.lineTool.retirerPoint).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit Backspace mais que ligne est inactive', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Backspace'});
    service.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
    spyOn(service.lineTool, 'retirerPoint');

    service.treatInput(clavier);

    expect(service.lineTool.retirerPoint).not.toHaveBeenCalled();
  });

  it('#treatInput devrait annuler la ligne en cours si il reçoit Escape et que ligne est active', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Escape'});
    service.tools.changeActiveTool(LINE_TOOL_INDEX);
    spyOn(service.lineTool, 'clear');

    service.treatInput(clavier);

    expect(service.lineTool.clear).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit Escape mais que ligne est inactive', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Escape'});
    service.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
    spyOn(service.lineTool, 'clear');

    service.treatInput(clavier);

    expect(service.lineTool.clear).not.toHaveBeenCalled();
  });

  it('#treatInput devrait emmettre un nouveau dessin si il reçoit o avec ctrl actif', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(service.newDrawingEmmiter, 'next');

    service.treatInput(clavier);

    expect(service.newDrawingEmmiter.next).toHaveBeenCalledWith(false);
  });

  it('#treatInput devrait empeche le declenchement du raccoruci Google Chrome si il reçoit o avec ctrl actif', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(clavier, 'preventDefault');

    service.treatInput(clavier);

    expect(clavier.preventDefault).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit o avec ctrl inactif', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'o'});
    spyOn(clavier, 'preventDefault');
    spyOn(service.newDrawingEmmiter, 'next');

    service.treatInput(clavier);

    expect(clavier.preventDefault).not.toHaveBeenCalled();
    expect(service.newDrawingEmmiter.next).not.toHaveBeenCalledWith(false);
  });

  it('#treatInput devrait appeler stockerCurseur de l\'outil ligne si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(LINE_TOOL_INDEX);
    spyOn(service.lineTool, 'stockerCurseur');

    service.treatInput(clavier);

    expect(service.lineTool.stockerCurseur).toHaveBeenCalled();
  });

  it('#treatInput devrait appeler ShiftEnfonce de l\'outil rectangle si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
    spyOn(service.rectangleTool, 'shiftPress');

    service.treatInput(clavier);

    expect(service.rectangleTool.shiftPress).toHaveBeenCalled();
  });

  // TESTS treatReleaseKey

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil rectangle si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
    spyOn(service.rectangleTool, 'shiftRelease');

    service.treatReleaseKey(clavier);

    expect(service.rectangleTool.shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil ligne si il reçoit Shift', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(LINE_TOOL_INDEX);
    spyOn(service.lineTool, 'ShiftRelease');

    service.treatReleaseKey(clavier);

    expect(service.lineTool.ShiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey ne fait rien dans le cas d\'une touche non programmée', () => {
    const clavier = new KeyboardEvent('keypress');

    // Dans le cas de la ligne
    service.tools.changeActiveTool(LINE_TOOL_INDEX);
    spyOn(service.lineTool, 'ShiftRelease');
    service.treatReleaseKey(clavier);
    expect(service.lineTool.ShiftRelease).not.toHaveBeenCalled();

    // Dans le cas du rectangle
    service.tools.changeActiveTool(RECTANGLE_TOOL_INDEX);
    spyOn(service.rectangleTool, 'shiftRelease');
    service.treatReleaseKey(clavier);
    expect(service.rectangleTool.shiftRelease).not.toHaveBeenCalled();

  });

});
