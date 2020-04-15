import { TestBed } from '@angular/core/testing';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { LineService } from '../../stockage-svg/draw-element/line.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { CONTENT_KEY, LocalSaveManagerService, PARAMETERS_KEY} from './local-save-manager.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('LocalSaveManagerService', () => {

  let service: LocalSaveManagerService;
  let savedDrawing: DrawingManagerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(LocalSaveManagerService));
  beforeEach(() => {
    savedDrawing = new DrawingManagerService();
    savedDrawing.id = 42;
    savedDrawing.height = 120;
    savedDrawing.width = 450;
    savedDrawing.backgroundColor = {RGBA: [0, 0, 255, 1], RGBAString: 'rgba(0, 0, 255, 1)'};
    savedDrawing.tags = ['tag1', 'tag2'];
    savedDrawing.name = 'name';
    service['currentDrawingParams'] = TestBed.get(DrawingManagerService);
    spyOn(JSON, 'parse').and.callFake((text) => {
      if (text === 'params') { return savedDrawing; }
      return [new LineService()];
    });
  });
  beforeEach(() => service['currentDrawingContent'] = TestBed.get(SVGStockageService));

  // TEST Constructeur
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TEST isStorageEmpty
  it('#isStorageEmpty devrait retourner vrai', () => {
    localStorage.clear();
    expect(service.isStorageEmpty()).toBe(true);
  });

  it('#isStorageEmpty devrait retourner faux', () => {
    localStorage.setItem('123', '456');
    expect(service.isStorageEmpty()).toBe(false);
  });

  // TEST saveState
  it('#saveState devrait passer par la methode setItem avec PARAMETER_KEY', () => {
    const spy = spyOn(localStorage, 'setItem');
    service.saveState();
    expect(spy).toHaveBeenCalledWith(PARAMETERS_KEY, JSON.stringify(service['currentDrawingParams']));
  });

  it('#saveState devrait passer par la methode setItem avec CONTENT_KEY', () => {
    spyOn(service['currentDrawingContent'], 'getCompleteSVG').and.returnValue([new LineService()]);
    const spy = spyOn(localStorage, 'setItem');
    service.saveState();
    expect(spy).toHaveBeenCalledWith(CONTENT_KEY, JSON.stringify([new LineService()]));
  });

  // TESTS loadState
  it('#loadState devrait appeler clear de localStorage si getItem de PARAMETERS_KEY est null', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === PARAMETERS_KEY) { return null; } return 'item'; });
    const spy = spyOn(localStorage, 'clear');
    service.loadState();
    expect(spy).toHaveBeenCalled();
  });

  it('#loadState devrait retourner faux si getItem de PARAMETERS_KEY est null', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === PARAMETERS_KEY) { return null; } return 'item'; });
    expect(service.loadState()).toBe(false);
  });

  it('#loadState devrait appeler clear de localStorage si getItem de CONTENT_KEY est null', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return null; } return 'item'; });
    const spy = spyOn(localStorage, 'clear');
    service.loadState();
    expect(spy).toHaveBeenCalled();
  });

  it('#loadState devrait retourner faux si getItem de CONTENT_KEY est null', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return null; } return 'item'; });
    expect(service.loadState()).toBe(false);
  });

  it('#loadState devrait appeler JSON.parse sur paramsCopy', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service.loadState();
    expect(JSON.parse).toHaveBeenCalledWith('params');
  });

  it('#loadState devrait appeler JSON.parse sur contentCopy', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service.loadState();
    expect(JSON.parse).toHaveBeenCalledWith('content');
  });

  it('#loadState devrait appeler JSON.parse sur contentCopy', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service.loadState();
    expect(JSON.parse).toHaveBeenCalledWith('content');
  });

  it('#loadState devrait changer l\'id du currentDrawing par l\'id de l\'état sauvegardé', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].id = 0;
    service.loadState();
    expect(service['currentDrawingParams'].id).toBe(42);
  });

  it('#loadState devrait changer la hauteur du currentDrawing par la hauteur de l\'état sauvegardé', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].height = 0;
    service.loadState();
    expect(service['currentDrawingParams'].height).toBe(120);
  });

  it('#loadState devrait changer la largeur du currentDrawing par la largeur de l\'état sauvegardé', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].width = 0;
    service.loadState();
    expect(service['currentDrawingParams'].width).toBe(450);
  });

  it('#loadState devrait changer la couleur de fond du currentDrawing par la couleur de fond de l\'état sauvegardé', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].backgroundColor = {RGBA: [0, 0, 0, 0], RGBAString: ''};
    service.loadState();
    expect(service['currentDrawingParams'].backgroundColor).toEqual({RGBA: [0, 0, 255, 1], RGBAString: 'rgba(0, 0, 255, 1)'});
  });

  it('#loadState devrait changer le nom du currentDrawing par un string vide', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].name = 'testName';
    service.loadState();
    expect(service['currentDrawingParams'].name).toBe('');
  });

  it('#loadState devrait changer les tags du currentDrawing par un tableau vide', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    service['currentDrawingParams'].tags = ['testTag'];
    service.loadState();
    expect(service['currentDrawingParams'].tags).toEqual([]);
  });

  it('#loadState devrait appeler cleanDrawing du currentDrawing', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    const spy = spyOn(service['currentDrawingContent'], 'cleanDrawing');
    service.loadState();
    expect(spy).toHaveBeenCalled();
  });

  /* 

  it('#loadState devrait appeler addElement de savingUtility avec les éléments trouvés', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    const spy = spyOn(service['savingUtility'], 'addElement');
    service.loadState();
    expect(spy).toHaveBeenCalledWith(new LineService());
  });

  */

  it('#loadState devrait retourner vrai si les valeurs de params et de content ne sont pas nulles', () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => { if (key === CONTENT_KEY) { return 'content'; } return 'params'; });
    expect(service.loadState()).toBe(true);
  });

});
