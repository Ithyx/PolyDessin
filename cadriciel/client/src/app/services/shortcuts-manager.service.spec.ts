import { async, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { ShortcutsManagerService } from './shortcuts-manager.service';
import { TOOL_INDEX } from './tools/tool-manager.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('ShortcutsManagerService', () => {

  let service: ShortcutsManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [MatDialogModule, BrowserAnimationsModule, NoopAnimationsModule],
    });
  }));

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ShortcutsManagerService));

  it('should be created', () => {
    const testService: ShortcutsManagerService = TestBed.get(ShortcutsManagerService);
    expect(testService).toBeTruthy();
  });

  // TESTS updatePositionTimer
    // TODO

  // TESTS treatInput
    // TODO

  // TESTS clearOngoingSVG

  it('#clearOngoingSVG devrait detruire la boite de selection en cours', () => {
    spyOn(service['selection'], 'deleteBoundingBox');
    service.clearOngoingSVG();
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#clearOngoingSVG devrait vider le SVGEnCours de l\' outil rectange', () => {
    spyOn(service['rectangleTool'], 'clear');
    service.clearOngoingSVG();
    expect(service['rectangleTool'].clear).toHaveBeenCalled();
  });

  it('#clearOngoingSVG devrait vider le SVGEnCours de l\' outil ligne', () => {
    spyOn(service['lineTool'], 'clear');
    service.clearOngoingSVG();
    expect(service['lineTool'].clear).toHaveBeenCalled();
  });

  // TESTS shorcutKey1

  it('#shortcutKey1 devrait changer l\'outil actif pour le rectange', () => {
    service.shortcutKey1();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.RECTANGLE);
  });

  it('#shortcutKey1 devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKey1();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shorcutKey2

  it('#shortcutKey2 devrait changer l\'outil actif pour l\'ellipse', () => {
    service.shortcutKey2();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.ELLIPSE);
  });

  it('#shortcutKey2 devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKey2();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shorcutKey3

  it('#shortcutKey3 devrait changer l\'outil actif pour le polygone', () => {
    service.shortcutKey3();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.POLYGON);
  });

  it('#shortcutKey3 devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKey3();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

   // TESTS shortcutKeyA

  it('#shortcutKeyA devrait changer l\'outil actif pour l\'aérosol si CTRL est inactif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});
    service.shortcutKeyA(keyboard);
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.SPRAY);
  });

  it('#shortcutKeyA devrait supprimer la boite de selection en cours', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    spyOn(service['selection'], 'deleteBoundingBox');
    service.shortcutKeyA(keyboard);
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#shortcutKeyA devrait changer changer l\'outil actif pour la sélection', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    service.shortcutKeyA(keyboard);
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.SELECTION);
  });

  it('#shortcutKeyA ne devrait pas changer créer de boite de sélection si le nombre d\'SVG est nul', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    spyOn(service['selection'], 'createBoundingBox');
    service.shortcutKeyA(keyboard);
    expect(service['selection'].createBoundingBox).not.toHaveBeenCalled();
  });

  // TODO : ShortcutKeyA dans le cas de plusieurs SVG

  // TESTS shortcutKeyC

  it('#shortcutKeyC devrait changer l\'outil actif pour le crayon', () => {
    service.shortcutKeyC();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.PENCIL);
  });

  it('#shortcutKeyC devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyC();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyE

  /* it('#shortcutKeyE devrait mettre focusOnInput à vrai si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'e' , ctrlKey: true});
    service.shortcutKeyE(keyboard);
    expect(service.focusOnInput).toEqual(true);
  });

  it('#shortcutKeyE devrait supprimer la boite de selection si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'e' , ctrlKey: true});
    spyOn(service['selection'], 'deleteBoundingBox');
    service.shortcutKeyE(keyboard);
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#shortcutKeyE devrait ouvrir le pop-up d\'exportation si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'e' , ctrlKey: true});
    spyOn(service['dialog'], 'open');
    service.shortcutKeyE(keyboard);
    expect(service['dialog'].open)
      .toHaveBeenCalledWith(ExportWindowComponent, service['dialogConfig']);
  });

  it('#shortcutKeyE devrait changer l\'outil actif pour l\'efface si CTRL n\'est pas appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'e' , ctrlKey: false});
    service.shortcutKeyE(keyboard);
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.ERASER);
  });

  it('#shortcutKeyE devrait supprimer le SVG en cours si CTRL n\'est pas appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'e' , ctrlKey: false});
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyE(keyboard);
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  }); */

  // TESTS shortcutKeyI

  it('#shortcutKeyI devrait changer l\'outil actif pour la pipette', () => {
    service.shortcutKeyI();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.PIPETTE);
  });

  it('#shortcutKeyC devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyI();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyL

  it('#shortcutKeyL devrait changer l\'outil actif pour la ligne', () => {
    service.shortcutKeyL();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.LINE);
  });

  it('#shortcutKeyL devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyL();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyW

  it('#shortcutKeyW devrait changer l\'outil actif pour la ligne', () => {
    service.shortcutKeyW();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.BRUSH);
  });

  it('#shortcutKeyW devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyW();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyS

  it('#shortcutKeyS devrait changer l\'outil actif pour la ligne', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 's' , ctrlKey: false});
    service.shortcutKeyS(keyboard);
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.SELECTION);
  });

  it('#shortcutKeyS devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    const keyboard = new KeyboardEvent('keypress', { key: 's' , ctrlKey: false});
    service.shortcutKeyS(keyboard);
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  
  // TESTS shortcutKeyZ

  it('#shortcutKeyZ devrait annuler la dernier commande si CTRL est actif et qu\'il n\'y a pas de dessin en cours', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'z' , ctrlKey: true});
    service['commands'].drawingInProgress = false;
    spyOn(service['commands'], 'cancelCommand');
    service.shortcutKeyZ(keyboard);
    expect(service['commands'].cancelCommand).toHaveBeenCalled();
  });

  it('#shortcutKeyZ ne devrait rien faire si CTRL n\'est pas actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'z' , ctrlKey: false});
    service['commands'].drawingInProgress = false;
    spyOn(service['commands'], 'cancelCommand');
    service.shortcutKeyZ(keyboard);
    expect(service['commands'].cancelCommand).not.toHaveBeenCalled();
  });

  it('#shortcutKeyZ ne devrait rien faire si un dessin est en cours', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'z' , ctrlKey: true});
    service['commands'].drawingInProgress = true;
    spyOn(service['commands'], 'cancelCommand');
    service.shortcutKeyZ(keyboard);
    expect(service['commands'].cancelCommand).not.toHaveBeenCalled();
  });

  // TESTS shortcutKeyUpperZ

  it('#shortcutKeyUpperZ devrait refaire la dernier commande si CTRL est actif et qu\'il n\'y a pas de dessin en cours', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Z' , ctrlKey: true});
    service['commands'].drawingInProgress = false;
    spyOn(service['commands'], 'redoCommand');
    service.shortcutKeyUpperZ(keyboard);
    expect(service['commands'].redoCommand).toHaveBeenCalled();
  });

  it('#shortcutKeyUpperZ ne devrait rien faire si CTRL n\'est pas actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Z' , ctrlKey: false});
    service['commands'].drawingInProgress = false;
    spyOn(service['commands'], 'redoCommand');
    service.shortcutKeyUpperZ(keyboard);
    expect(service['commands'].redoCommand).not.toHaveBeenCalled();
  });

  it('#shortcutKeyUpperZ ne devrait rien faire si un dessin est en cours', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Z' , ctrlKey: true});
    service['commands'].drawingInProgress = true;
    spyOn(service['commands'], 'redoCommand');
    service.shortcutKeyUpperZ(keyboard);
    expect(service['commands'].redoCommand).not.toHaveBeenCalled();
  });

  // TESTS shortcutKeyShift

  it('#shortcutKeyShift devrait appeler shiftPress si l\'outil actif est le rectangle', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.RECTANGLE];
    spyOn(service['rectangleTool'], 'shiftPress');
    service.shortcutKeyShift();
    expect(service['rectangleTool'].shiftPress).toHaveBeenCalled();
  });

  it('#shortcutKeyShift devrait memoriser la position du curseur si l\'outil actif est la ligne', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.LINE];
    spyOn(service['lineTool'], 'memorizeCursor');
    service.shortcutKeyShift();
    expect(service['lineTool'].memorizeCursor).toHaveBeenCalled();
  });

  it('#shortcutKeyShift ne devrait rien faire si l\'outil actif n\'est ni la ligne ou le rectangle', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.PENCIL];
    spyOn(service['lineTool'], 'memorizeCursor');
    spyOn(service['rectangleTool'], 'shiftPress');
    service.shortcutKeyShift();
    expect(service['lineTool'].memorizeCursor).not.toHaveBeenCalled();
    expect(service['rectangleTool'].shiftPress).not.toHaveBeenCalled();
  });

  // TESTS shortcutKeyO

  it('#shortcutKeyO devrait emettre un nouveau dessin avec l\'attribut false si CTRL est actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(service.newDrawingEmmiter, 'next');
    service.shortcutKeyO(keyboard);
    expect(service.newDrawingEmmiter.next).toHaveBeenCalledWith(false);
  });

  it('#shortcutKeyO devrait detruire la boite de selection si CTRL est actif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: true});
    spyOn(service['selection'], 'deleteBoundingBox');
    service.shortcutKeyO(keyboard);
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#shortcutKeyO ne devrait rien faire si CTRL est inactif', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o' , ctrlKey: false});
    spyOn(service.newDrawingEmmiter, 'next');
    spyOn(service['selection'], 'deleteBoundingBox');
    spyOn(keyboard, 'preventDefault');
    service.shortcutKeyO(keyboard);
    expect(service.newDrawingEmmiter.next).not.toHaveBeenCalledWith(false);
    expect(service['selection'].deleteBoundingBox).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

  // TESTS shortcutKeyBackSpace

  it('#shortcutKeyBackSpace devrait retirer le dernier si l\'outil acitf est la ligne', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.LINE];
    spyOn(service['lineTool'], 'removePoint');
    service.shortcutKeyBackSpace();
    expect(service['lineTool'].removePoint).toHaveBeenCalled();
  });

  it('#shortcutKeyBackSpace ne devrait pas retirer le dernier si l\'outil acitf n\'est pas la ligne', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.PENCIL];
    spyOn(service['lineTool'], 'removePoint');
    service.shortcutKeyBackSpace();
    expect(service['lineTool'].removePoint).not.toHaveBeenCalled();
  });

  // TESTS shortcutKeyEscape

  it('#shortcutKeyEscape devrait supprimer la ligne en cours si l\'outil acitf est la ligne', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.LINE];
    spyOn(service['lineTool'], 'clear');
    service.shortcutKeyEscape();
    expect(service['lineTool'].clear).toHaveBeenCalled();
  });

  it('#shortcutKeyEscape ne devrait pas supprimer la ligne en cours si l\'outil acitf est la ligne', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.PENCIL];
    spyOn(service['lineTool'], 'clear');
    service.shortcutKeyEscape();
    expect(service['lineTool'].clear).not.toHaveBeenCalled();
  });

  // TESTS shortcutG

  it('#shortcutKeyG devrait inverser l\'etat d\'affichage de la grille', () => {
    service['grid'].showGrid = false;
    const keyboard = new KeyboardEvent('keypress', { key: 'g' , ctrlKey: false});
    service.shortcutKeyG(keyboard);
    expect(service['grid'].showGrid).toBe(true);
  });

  // TESTS shortcutKeyPlus

  it('#shortcutKeyPlus devrait augmenter l\'espace de la grille', () => {
    spyOn(service['grid'], 'increaseSize');
    service.shortcutKeyPlus();
    expect(service['grid'].increaseSize).toHaveBeenCalled();
  });

  // TESTS shortcutKeyMinus

  it('#shortcutKeyMinus devrait diminuer l\'espace de la grille', () => {
    spyOn(service['grid'], 'decreaseSize');
    service.shortcutKeyMinus();
    expect(service['grid'].decreaseSize).toHaveBeenCalled();
  });

   // TESTS shortcutArrowLeft

  it('#shortcutKeyArrowLeft devrait mettre leftArrow à vrai', () => {
    service.shortcutKeyArrowLeft();
    expect(service['leftArrow']).toBe(true);
  });

  // TESTS shortcutArrowRight

  it('#shortcutKeyArrowRight devrait mettre RightArrow à vrai', () => {
    service.shortcutKeyArrowRight();
    expect(service['rightArrow']).toBe(true);
  });

  // TESTS shortcutArrowDown

  it('#shortcutKeyArrowDown devrait mettre DownArrow à vrai', () => {
    service.shortcutKeyArrowDown();
    expect(service['downArrow']).toBe(true);
  });

  // TESTS shortcutArrowUp

  it('#shortcutKeyArrowUp devrait mettre UpArrow à vrai', () => {
    service.shortcutKeyArrowUp();
    expect(service['upArrow']).toBe(true);
  });

  // TESTS treatReleaseKey

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil rectangle si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service['tools'].changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service['rectangleTool'], 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service['rectangleTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil ligne si il reçoit Shift', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service['tools'].changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service['lineTool'], 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service['lineTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait mettre leftArrow a false si il reçoit ArrowLeft', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowLeft'});
    service.treatReleaseKey(keyboard);
    expect(service['leftArrow']).toBe(false);
  });

  it('#treatReleaseKey devrait mettre rightArrow a false si il reçoit ArrowRight', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowRight'});
    service.treatReleaseKey(keyboard);
    expect(service['rightArrow']).toBe(false);
  });

  it('#treatReleaseKey devrait mettre upArrow a false si il reçoit ArrowUp', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowUp'});
    service.treatReleaseKey(keyboard);
    expect(service['upArrow']).toBe(false);
  });

  it('#treatReleaseKey devrait mettre downArrow a false si il reçoit ArrowDown', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowDown'});
    service.treatReleaseKey(keyboard);
    expect(service['downArrow']).toBe(false);
  });

  it('#treatReleaseKey ne fait rien dans le cas d\'une touche non programmée', () => {
    const keyboard = new KeyboardEvent('keypress');

    // Dans le cas de la ligne
    service['tools'].changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service['lineTool'], 'shiftRelease');
    service.treatReleaseKey(keyboard);
    expect(service['lineTool'].shiftRelease).not.toHaveBeenCalled();

    // Dans le cas du rectangle
    service['tools'].changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service['rectangleTool'], 'shiftRelease');
    service.treatReleaseKey(keyboard);
    expect(service['rectangleTool'].shiftRelease).not.toHaveBeenCalled();

  });

  // TODO: Désactiver limite fichier avec TSLINT
});
