/*
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatProgressSpinnerModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExportWindowComponent } from '../components/export-window/export-window.component';
import { GalleryLoadWarningComponent } from '../components/gallery-load-warning/gallery-load-warning.component';
import { GalleryElementComponent } from '../components/gallery/gallery-element/gallery-element.component';
import { GalleryComponent } from '../components/gallery/gallery.component';
import { SavePopupComponent } from '../components/save-popup/save-popup.component';
import { ShortcutsManagerService } from './shortcuts-manager.service';
import { DrawElement } from './stockage-svg/draw-element/draw-element';
import { TOOL_INDEX } from './tools/tool-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count

describe('ShortcutsManagerService', () => {
  const injector = Injector.create(
    // tslint:disable-next-line: arrow-return-shorthand
    {providers: [{provide: MatDialogRef, useValue: {afterClosed: () => { return {subscribe: () => { service.focusOnInput = false; }}; }}}]
  });

  let service: ShortcutsManagerService;

  const element: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updateRotation: () => { return; },
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
    updateParameters: () => { return; }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ ExportWindowComponent, SavePopupComponent, GalleryComponent, GalleryElementComponent, GalleryLoadWarningComponent],
        imports: [ MatProgressSpinnerModule, MatDialogModule, BrowserAnimationsModule,  ReactiveFormsModule,
                   FormsModule, RouterModule.forRoot([{path: 'dessin', component: GalleryComponent}]), RouterTestingModule],
        providers: [HttpClient, HttpHandler]
    })
    .overrideModule(BrowserDynamicTestingModule, {set: { entryComponents: [ ExportWindowComponent,
                                                                                SavePopupComponent, GalleryComponent ] }})
    .compileComponents();
  }));

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ShortcutsManagerService));

  // TESTS constructor
  it('should be created', () => {
    const testService: ShortcutsManagerService = TestBed.get(ShortcutsManagerService);
    expect(testService).toBeTruthy();
  });

  // TESTS updatePositionTimer

  it('#updatePositionTimer ne devrait rien faire s\'il n\'y a pas de boite de selection', () => {
    spyOn(window, 'clearInterval');
    spyOn(window, 'setInterval');
    spyOn(service['selection'], 'updateTranslation');
    spyOn(service['commands'], 'execute');

    service.updatePositionTimer();
    expect(window.clearInterval).not.toHaveBeenCalled();
    expect(window.setInterval).not.toHaveBeenCalled();
    expect(service['selection'].updateTranslation).not.toHaveBeenCalled();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#updatePositionTimer devrait remettre le compteur à 0 si aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    service.updatePositionTimer();
    expect(service['counter100ms']).toEqual(0);
    expect(service['clearTimeout']).toEqual(0);
  });

  it('#updatePositionTimer devrait appeler clearInterval de la fenêtre si aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    spyOn(window, 'clearInterval');
    service.updatePositionTimer();
    expect(window.clearInterval).toHaveBeenCalledWith(service['clearTimeout']);
  });


  it('#updatePositionTimer ne devrait pas executer de commande de translastion si le SVG n\' a pas bougé et '
    + 'qu\'aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    element.translate = {x: 0, y: 0};
    service['selection'].handleClick(element);    // création de la boite de sélection
    spyOn(service['commands'], 'execute');
    service.updatePositionTimer();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#updatePositionTimer devrait executer une commande translastion si le SVG a été bougé et qu\'aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    element.translate = {x: 10, y: 10};
    service['selection'].handleClick(element);    // création de la boite de sélection
    spyOn(service['commands'], 'execute');
    service.updatePositionTimer();
    expect(service['commands'].execute).toHaveBeenCalledWith(new TranslateSvgService(
                                service['selection'].selectedElements,
                                service['selection'].selectionBox,
                                service['sanitizer'],
                                service['selection'].deleteBoundingBox
    ));
  });

  it('#updatePositionTimer devrait appeler translateSelection si aucune flèche n\'est appuyé et que clearTimeout est à 0', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    const spy = spyOn(service, 'translateSelection');
    service['arrowKeys'][0] = true;
    service['clearTimeout'] = 0;
    service.updatePositionTimer();
    expect(spy).toHaveBeenCalled();
  });

  it('#updatePositionTimer ne devrait pas appeler translateSelection si aucune flèche n\'est appuyé et ' +
  'que clearTimeout est différent de 0', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    const spy = spyOn(service, 'translateSelection');
    service['arrowKeys'][0]  = true;
    service['clearTimeout'] = 25;
    service.updatePositionTimer();
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS translateSelection

  it('#translateSelection devrait appeler updateTranslation de la selection si counter100ms est inférieur ou égal à 1', () => {
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalled();
  });

  it('#translateSelection devrait appeler updateTranslation de la selection si counter100ms est supérieur ou égal à 5', () => {
    service['counter100ms'] = 6;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalled();
  });

  it('#translateSelection ne devrait rien faire si counter100ms est entre 2 et 4', () => {
    service['counter100ms'] = 3;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#translateSelection devrait déplacer de 3 pixel sur l\'axe des x si rightArrow est true', () => {
    service['arrowKeys'][1] = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(3, 0);
  });

  it('#translateSelection devrait déplacer de -3 pixel sur l\'axe des x si leftArrow est true', () => {
    service['arrowKeys'][0]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(-3, 0);
  });

  it('#translateSelection devrait déplacer de 3 pixel sur l\'axe des y si downArrow est true', () => {
    service['arrowKeys'][3]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(0, 3);
  });

  it('#translateSelection devrait déplacer de -3 pixel sur l\'axe des y si upArrow est true', () => {
    service['arrowKeys'][2]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(0, -3);
  });

  // TESTS treatInput

  it('#treatInput ne devrait rien faire si on a un focus sur les entrées', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});
    service.focusOnInput = true;

    spyOn(service, 'updatePositionTimer');
    spyOn(keyboard, 'preventDefault');

    service.treatInput(keyboard);
    expect(service.updatePositionTimer).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

  it('#treatInput devrait appeler updatePositionTimer si la touche est reconnue', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});

    spyOn(service, 'updatePositionTimer');

    service.treatInput(keyboard);
    expect(service.updatePositionTimer).toHaveBeenCalled();
  });

  it('#treatInput devrait appeler updatePositionTimer si la touche est non reconnue', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'test' , ctrlKey: false});

    spyOn(service, 'updatePositionTimer');

    service.treatInput(keyboard);
    expect(service.updatePositionTimer).toHaveBeenCalled();
  });

  it('#treatInput devrait si la touche est reconnue, bloquer les raccourcis', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});

    spyOn(keyboard, 'preventDefault');

    service.treatInput(keyboard);
    expect(keyboard.preventDefault).toHaveBeenCalled();
  });

  // TESTS enableShortcuts
  it('#enableShortcuts devrait mettre l\'attribut focusOnInput à false', () => {
    service['focusOnInput'] = true;
    service.enableShortcuts();
    expect(service['focusOnInput']).toBe(false);
  });

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

  it('#shortcutKeyA devrait créer une boite de sélection si le nombre d\'SVG est non-nul', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    service['svgStockage'].addSVG(element);
    service.shortcutKeyA(keyboard);
    expect(service['selection'].selectedElements[0]).toEqual(service['svgStockage'].getCompleteSVG()[0]);
  });

  it('#shortcutKeyA devrait créer une boite de sélection si le nombre d\'SVG est non-nul', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    service['svgStockage'].addSVG(element);
    service.shortcutKeyA(keyboard);
    expect(service['svgStockage'].getCompleteSVG()[0].isSelected).toEqual(true);
  }); 

  it('#shortcutKeyA devrait mettre les éléments sélectionné du svgStockage si le nombre d\'SVG est non-nul', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: true});
    service['svgStockage'].addSVG(element);
    spyOn(service['selection'], 'createBoundingBox');
    service.shortcutKeyA(keyboard);
    expect(service['selection'].createBoundingBox).toHaveBeenCalled();
  });

  // TESTS shortcutKeyC

  it('#shortcutKeyC devrait changer l\'outil actif pour le crayon', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'c' });
    service.shortcutKeyC(keyboard);
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.PENCIL);
  });

  it('#shortcutKeyC devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    const keyboard = new KeyboardEvent('keypress', { key: 'c' });
    service.shortcutKeyC(keyboard);
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyE

  it('#shortcutKeyE devrait mettre focusOnInput à vrai si CRTL est appuyé', () => {
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
    spyOn(service['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
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
  });

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

  // TESTS shortcutKeyR

  it('#shortcutKeyR devrait changer l\'outil actif pour l\'Applicateur de Couleur', () => {
    service.shortcutKeyR();
    expect(service['tools'].activeTool.ID).toEqual(TOOL_INDEX.COLOR_CHANGER);
  });

  it('#shortcutKeyR devrait supprimer le SVG en cours', () => {
    spyOn(service, 'clearOngoingSVG');
    service.shortcutKeyR();
    expect(service.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS shortcutKeyS

  it('#shortcutKeyS devrait mettre focusOnInput à vrai si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 's' , ctrlKey: true});
    service.shortcutKeyS(keyboard);
    expect(service.focusOnInput).toEqual(true);
  });

  it('#shortcutKeyS devrait supprimer la boite de selection si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 's' , ctrlKey: true});
    spyOn(service['selection'], 'deleteBoundingBox');
    service.shortcutKeyS(keyboard);
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#shortcutKeyS devrait ouvrir le pop-up de sauvegarde si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 's' , ctrlKey: true});
    spyOn(service['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    service.shortcutKeyS(keyboard);
    expect(service['dialog'].open)
      .toHaveBeenCalledWith(SavePopupComponent, service['dialogConfig']);
  });

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
    spyOn(service['lineTool'], 'shiftPress');
    service.shortcutKeyShift();
    expect(service['lineTool'].shiftPress).toHaveBeenCalled();
  });

  it('#shortcutKeyShift devrait appeler shiftPress si l\'outil actif est l\'ellipse', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.ELLIPSE];
    spyOn(service['ellipseTool'], 'shiftPress');
    service.shortcutKeyShift();
    expect(service['ellipseTool'].shiftPress).toHaveBeenCalled();
  });

  it('#shortcutKeyShift ne devrait rien faire si l\'outil actif n\'est ni la ligne ou le rectangle', () => {
    service['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.PENCIL];
    spyOn(service['lineTool'], 'shiftPress');
    spyOn(service['ellipseTool'], 'shiftPress');
    spyOn(service['rectangleTool'], 'shiftPress');
    service.shortcutKeyShift();
    expect(service['lineTool'].shiftPress).not.toHaveBeenCalled();
    expect(service['rectangleTool'].shiftPress).not.toHaveBeenCalled();
    expect(service['ellipseTool'].shiftPress).not.toHaveBeenCalled();
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

  // TESTS shortcutKeyG

  it('#shortcutKeyG devrait mettre focusOnInput à vrai si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'g' , ctrlKey: true});
    service.shortcutKeyG(keyboard);
    expect(service.focusOnInput).toEqual(true);
  });

  it('#shortcutKeyG devrait supprimer la boite de selection si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'g' , ctrlKey: true});
    spyOn(service['selection'], 'deleteBoundingBox');
    service.shortcutKeyG(keyboard);
    expect(service['selection'].deleteBoundingBox).toHaveBeenCalled();
  });

  it('#shortcutKeyG devrait ouvrir le pop-up d\'exportation si CRTL est appuyé', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'g' , ctrlKey: true});
    spyOn(service['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    service.shortcutKeyG(keyboard);
    expect(service['dialog'].open)
      .toHaveBeenCalledWith(GalleryComponent, service['dialogConfig']);
  });

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
    expect(service['arrowKeys'][0] ).toBe(true);
  });

  // TESTS shortcutArrowRight

  it('#shortcutKeyArrowRight devrait mettre RightArrow à vrai', () => {
    service.shortcutKeyArrowRight();
    expect(service['arrowKeys'][1]).toBe(true);
  });

  // TESTS shortcutArrowDown

  it('#shortcutKeyArrowDown devrait mettre DownArrow à vrai', () => {
    service.shortcutKeyArrowDown();
    expect(service['arrowKeys'][3] ).toBe(true);
  });

  // TESTS shortcutArrowUp

  it('#shortcutKeyArrowUp devrait mettre UpArrow à vrai', () => {
    service.shortcutKeyArrowUp();
    expect(service['arrowKeys'][2] ).toBe(true);
  });

  // TESTS treatReleaseKey

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil rectangle si il reçoit Shift et l\'outil rectangle est sélectionné', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service['tools'].changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service['rectangleTool'], 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service['rectangleTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil ligne si il reçoit Shift et l\'outil ligne est sélectionné', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service['tools'].changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service['lineTool'], 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service['lineTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler shiftRelache de l\'outil ellipse si il reçoit Shift et l\'outil ellipse est sélectionné', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'Shift'});
    service['tools'].changeActiveTool(TOOL_INDEX.ELLIPSE);
    spyOn(service['ellipseTool'], 'shiftRelease');

    service.treatReleaseKey(keyboard);

    expect(service['ellipseTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait mettre leftArrow a false si il reçoit ArrowLeft', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowLeft'});
    service.treatReleaseKey(keyboard);
    expect(service['arrowKeys'][0] ).toBe(false);
  });

  it('#treatReleaseKey devrait mettre rightArrow a false si il reçoit ArrowRight', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowRight'});
    service.treatReleaseKey(keyboard);
    expect(service['arrowKeys'][1]).toBe(false);
  });

  it('#treatReleaseKey devrait mettre upArrow a false si il reçoit ArrowUp', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowUp'});
    service.treatReleaseKey(keyboard);
    expect(service['arrowKeys'][2] ).toBe(false);
  });

  it('#treatReleaseKey devrait mettre downArrow a false si il reçoit ArrowDown', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'ArrowDown'});
    service.treatReleaseKey(keyboard);
    expect(service['arrowKeys'][3] ).toBe(false);
  });

  it('#treatReleaseKey devrait appeler updatePositionTimer', () => {
    const keyboard = new KeyboardEvent('keyrelease', { key: 'u'});
    const spy = spyOn(service, 'updatePositionTimer');
    service.treatReleaseKey(keyboard);
    expect(spy).toHaveBeenCalled();
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

    // Dans le cas de l'ellipse
    service['tools'].changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service['ellipseTool'], 'shiftRelease');
    service.treatReleaseKey(keyboard);
    expect(service['ellipseTool'].shiftRelease).not.toHaveBeenCalled();

  });

}); */
