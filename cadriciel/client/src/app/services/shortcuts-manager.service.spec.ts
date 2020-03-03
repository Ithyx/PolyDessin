import { TestBed } from '@angular/core/testing';
import { ShortcutsManagerService } from './shortcuts-manager.service';
import { TOOL_INDEX } from './tools/tool-manager.service';

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
    spyOn(service.rectangleTool, 'clear');
    service.clearOngoingSVG();
    expect(service.rectangleTool.clear).toHaveBeenCalled();
  });

  it('#clearOngoingSVG devrait vider le SVGEnCours de l\' outil ligne', () => {
    spyOn(service.lineTool, 'clear');
    service.clearOngoingSVG();
    expect(service.lineTool.clear).toHaveBeenCalled();
  });

  // TESTS treatInput

  it('#treatInput ne fait rien si le focus est sur un champ de texte', () => {
    const keyboard = new KeyboardEvent('keypress', { key: '1'});
    service.focusOnInput = true;

    spyOn(service, 'clearOngoingSVG');

    service.treatInput(keyboard);

    expect(service.clearOngoingSVG).not.toHaveBeenCalled();         // On ne devrait pas vider le SVG en cours
    expect(service.tools.activeTool.name).not.toBe('Rectangle');    // On ne devrait pas changer d'outil actif
  });

  it('#treatInput devrait mettre rectangle comme outil actif si il reçoit 1', () => {
    const keyboard = new KeyboardEvent('keypress', { key: '1'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(keyboard);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Rectangle');
  });

  it('#treatInput devrait mettre crayon comme outil actif si il reçoit c', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'c'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(keyboard);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Crayon');
  });

  it('#treatInput devrait mettre ligne comme outil actif si il reçoit l', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'l'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(keyboard);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Ligne');
  });

  it('#treatInput devrait mettre pinceau comme outil actif si il reçoit w', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'w'});
    spyOn(service, 'clearOngoingSVG');

    service.treatInput(keyboard);

    expect(service.clearOngoingSVG).toHaveBeenCalled();
    expect(service.tools.activeTool.name).toBe('Pinceau');
  });

  it('#treatInput devrait retirer le dernier point en cours si il reçoit Backspace et que ligne est active', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Backspace'});
    service.tools.changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service.lineTool, 'removePoint');

    service.treatInput(keyboard);

    expect(service.lineTool.removePoint).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit Backspace mais que ligne est inactive', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Backspace'});
    service.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service.lineTool, 'removePoint');

    service.treatInput(keyboard);

    expect(service.lineTool.removePoint).not.toHaveBeenCalled();
  });

  it('#treatInput devrait annuler la ligne en cours si il reçoit Escape et que ligne est active', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Escape'});
    service.tools.changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service.lineTool, 'clear');

    service.treatInput(keyboard);

    expect(service.lineTool.clear).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit Escape mais que ligne est inactive', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Escape'});
    service.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service.lineTool, 'clear');

    service.treatInput(keyboard);

    expect(service.lineTool.clear).not.toHaveBeenCalled();
  });

  it('#treatInput devrait emmettre un nouveau dessin si il reçoit o avec ctrl actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(service.newDrawingEmmiter, 'next');

    service.treatInput(keyboard);

    expect(service.newDrawingEmmiter.next).toHaveBeenCalledWith(false);
  });

  it('#treatInput devrait empeche le declenchement du raccoruci Google Chrome si il reçoit o avec ctrl actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(keyboard, 'preventDefault');

    service.treatInput(keyboard);

    expect(keyboard.preventDefault).toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si il reçoit o avec ctrl inactif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o'});
    spyOn(keyboard, 'preventDefault');
    spyOn(service.newDrawingEmmiter, 'next');

    service.treatInput(keyboard);

    expect(keyboard.preventDefault).not.toHaveBeenCalled();
    expect(service.newDrawingEmmiter.next).not.toHaveBeenCalledWith(false);
  });

  it('#treatInput devrait appeler memorizeCursor de l\'outil ligne si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service.lineTool, 'memorizeCursor');

    service.treatInput(keyboard);

    expect(service.lineTool.memorizeCursor).toHaveBeenCalled();
  });

  it('#treatInput devrait appeler ShiftEnfonce de l\'outil rectangle si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service.rectangleTool, 'shiftPress');

    service.treatInput(keyboard);

    expect(service.rectangleTool.shiftPress).toHaveBeenCalled();
  });

  // TESTS treatReleaseKey

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil rectangle si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service.rectangleTool, 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service.rectangleTool.shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil ligne si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service.tools.changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service.lineTool, 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service.lineTool.shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait mettre leftArrow a false si il reçoit ArrowLeft', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowLeft'});
    service.treatReleaseKey(keyboard);
    expect(service.leftArrow).toBe(false);
  });

  it('#treatReleaseKey devrait mettre rightArrow a false si il reçoit ArrowRight', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowRight'});
    service.treatReleaseKey(keyboard);
    expect(service.rightArrow).toBe(false);
  });

  it('#treatReleaseKey devrait mettre upArrow a false si il reçoit ArrowUp', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowUp'});
    service.treatReleaseKey(keyboard);
    expect(service.upArrow).toBe(false);
  });

  it('#treatReleaseKey devrait mettre downArrow a false si il reçoit ArrowDown', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowDown'});
    service.treatReleaseKey(keyboard);
    expect(service.downArrow).toBe(false);
  });

  it('#treatReleaseKey ne fait rien dans le cas d\'une touche non programmée', () => {
    const keyboard = new KeyboardEvent('keypress');

    // Dans le cas de la ligne
    service.tools.changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service.lineTool, 'shiftRelease');
    service.treatReleaseKey(keyboard);
    expect(service.lineTool.shiftRelease).not.toHaveBeenCalled();

    // Dans le cas du rectangle
    service.tools.changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service.rectangleTool, 'shiftRelease');
    service.treatReleaseKey(keyboard);
    expect(service.rectangleTool.shiftRelease).not.toHaveBeenCalled();

  });

});
