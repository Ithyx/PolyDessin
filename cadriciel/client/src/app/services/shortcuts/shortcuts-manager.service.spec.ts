
import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExportWindowComponent } from '../../components/export-window/export-window.component';
import { GalleryLoadWarningComponent } from '../../components/gallery-load-warning/gallery-load-warning.component';
import { GalleryElementComponent } from '../../components/gallery/gallery-element/gallery-element.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { SavePopupComponent } from '../../components/save-popup/save-popup.component';
import { CanvasConversionService } from '../canvas-conversion.service';
import { TransformSvgService } from '../command/transform-svg.service';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { TOOL_INDEX } from '../tools/tool-manager.service';
import { ShortcutsManagerService } from './shortcuts-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count

describe('ShortcutsManagerService', () => {
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
    updateScale: () => { return; },
    calculateRotation: () => { return; },
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
        providers: [HttpClient, HttpHandler, {provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }}}]
    })
    .overrideModule(BrowserDynamicTestingModule, {set: { entryComponents: [ ExportWindowComponent,
                                                                                SavePopupComponent, GalleryComponent ] }})
    .compileComponents();
  }));

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(ShortcutsManagerService));
  beforeEach(() => {
    service['transformCommand'] = new TransformSvgService([], TestBed.get(DomSanitizer), () => {return ; });
  });
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

  it('#updatePositionTimer ne devrait pas executer de commande de transformation si le SVG n\' a pas bougé et '
    + 'qu\'aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    spyOn(service['commands'], 'execute');
    service.updatePositionTimer();
    expect(service['commands'].execute).not.toHaveBeenCalled();
  });

  it('#updatePositionTimer devrait executer une commande transformation si le SVG a été bougé et qu\'aucune flèche n\'est appuyé', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    spyOn(service['commands'], 'execute');
    spyOn(TransformSvgService.prototype, 'hasMoved').and.returnValue(true);
    service.updatePositionTimer();
    expect(service['commands'].execute).toHaveBeenCalled();
  });

  it('#updatePositionTimer ne devrait pas creer de nouvelle transformCommand si le counter100ms n\'est pas a 0', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    service['counter100ms'] = 10;
    spyOn(TransformSvgService.prototype, 'hasMoved').and.returnValue(true);
    service['transformCommand'] = new TransformSvgService([], TestBed.get(DomSanitizer), () => 10);
    service.updatePositionTimer();
    expect(JSON.stringify(service['transformCommand']))
    .toEqual(JSON.stringify(new TransformSvgService([], TestBed.get(DomSanitizer), () => 10)));
  });

  it('#updatePositionTimer devrait appeler translateSelection si aucune flèche n\'est appuyé et que clearTimeout est à 0', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    const spy = spyOn(service, 'translateSelection');
    service.shortcutsFunctions['arrowKeyIsPress'][0] = true;
    service['clearTimeout'] = 0;
    service.updatePositionTimer();
    expect(spy).toHaveBeenCalled();
  });

  it('#updatePositionTimer ne devrait pas appeler translateSelection si aucune flèche n\'est appuyé et ' +
  'que clearTimeout est différent de 0', () => {
    service['selection'].selectionBox['tools'].activeTool = service['tools'].toolList[TOOL_INDEX.SELECTION];
    service['selection'].handleClick(element);    // création de la boite de sélection
    const spy = spyOn(service, 'translateSelection');
    service.shortcutsFunctions['arrowKeyIsPress'][0]  = true;
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
    service.shortcutsFunctions['arrowKeyIsPress'][1] = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(3, 0);
  });

  it('#translateSelection devrait déplacer de -3 pixel sur l\'axe des x si leftArrow est true', () => {
    service.shortcutsFunctions['arrowKeyIsPress'][0]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(-3, 0);
  });

  it('#translateSelection devrait déplacer de 3 pixel sur l\'axe des y si downArrow est true', () => {
    service.shortcutsFunctions['arrowKeyIsPress'][3]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(0, 3);
  });

  it('#translateSelection devrait déplacer de -3 pixel sur l\'axe des y si upArrow est true', () => {
    service.shortcutsFunctions['arrowKeyIsPress'][2]  = true;
    const spy = spyOn(service['selection'], 'updateTranslation');
    service.translateSelection();
    expect(spy).toHaveBeenCalledWith(0, -3);
  });

  // TESTS treatInput

  it('#treatInput ne devrait rien faire si on a un focus sur les entrées dans shortcutManager', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});
    service.focusOnInput = true;

    spyOn(service, 'updatePositionTimer');
    spyOn(keyboard, 'preventDefault');

    service.treatInput(keyboard);
    expect(service.updatePositionTimer).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

  it('#treatInput ne devrait rien faire si on a un focus sur les entrées dans shortcutFunctions', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'a' , ctrlKey: false});
    service.shortcutsFunctions.focusOnInput = true;

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

  // TESTS releaseKeyShift

  it('#releaseKeyShift devrait appeler shiftRelache de l\'outil rectangle si l\'outil rectangle est sélectionné', () => {
    service['tools'].changeActiveTool(TOOL_INDEX.RECTANGLE);
    spyOn(service['rectangleTool'], 'shiftRelease');

    service.releaseKeyShift();

    expect(service['rectangleTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#releaseKeyShift devrait appeler shiftRelache de l\'outil ligne si l\'outil ligne est sélectionné', () => {
    service['tools'].changeActiveTool(TOOL_INDEX.LINE);
    spyOn(service['lineTool'], 'shiftRelease');

    service.releaseKeyShift();

    expect(service['lineTool'].shiftRelease).toHaveBeenCalled();
  });

  it('#releaseKeyShift devrait appeler shiftRelache de l\'outil ellipse si  l\'outil ellipse est sélectionné', () => {
    service['tools'].changeActiveTool(TOOL_INDEX.ELLIPSE);
    spyOn(service.shortcutsFunctions['ellipseTool'], 'shiftRelease');

    service.releaseKeyShift();

    expect(service.shortcutsFunctions['ellipseTool'].shiftRelease).toHaveBeenCalled();
  });

  // TESTS releaseKeyArrowLeft

  it('#releaseKeyArrowLeft devrait mettre leftArrow a false', () => {
    service.releaseKeyArrowLeft();
    expect(service.shortcutsFunctions['arrowKeyIsPress'][0] ).toBe(false);
  });

  // TESTS releaseKeyArrowRight

  it('#releaseKeyArrowRight devrait mettre rightArrow a false', () => {
    service.releaseKeyArrowRight();
    expect(service.shortcutsFunctions['arrowKeyIsPress'][1]).toBe(false);
  });

  // TESTS releaseKeyArrowUp

  it('#releaseKeyArrowUp devrait mettre upArrow a false', () => {
    service.releaseKeyArrowUp();
    expect(service.shortcutsFunctions['arrowKeyIsPress'][2]).toBe(false);
  });

   // TESTS releaseKeyArrowRight

  it('#releaseKeyArrowDown devrait mettre downArrow a false', () => {
    service.releaseKeyArrowDown();
    expect(service.shortcutsFunctions['arrowKeyIsPress'][3]).toBe(false);
  });

    // TESTS treatReleaseKey

  it('#treatReleaseKey ne fait rien dans le cas d\'une touche non programmée', () => {
    const keyboard = new KeyboardEvent('keypress');
    spyOn(keyboard, 'preventDefault');
    spyOn(service, 'updatePositionTimer');
    // Dans le cas de prevent default
    service.treatReleaseKey(keyboard);
    expect(keyboard.preventDefault).not.toHaveBeenCalled();

    // Dans le cas de updatePositionTimer
    service.treatReleaseKey(keyboard);
    expect(service.updatePositionTimer).not.toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler preventDefault si la touche est reconnue', () => {
    const keyboard = new KeyboardEvent('keypress', {key: 'Shift'});
    spyOn(keyboard, 'preventDefault');
    service.treatReleaseKey(keyboard);
    expect(keyboard.preventDefault).toHaveBeenCalled();
  });

  it('#treatReleaseKey devrait appeler updatePositionTimer si la touche est reconnue', () => {
    const keyboard = new KeyboardEvent('keypress', {key: 'Shift'});
    spyOn(service, 'updatePositionTimer' );
    service.treatReleaseKey(keyboard);
    expect(service.updatePositionTimer).toHaveBeenCalled();
  });

});
