import { TestBed } from '@angular/core/testing';
import { DrawingManagerService } from '../../drawing-manager/drawing-manager.service';
import { CONTENT_KEY, LocalSaveManagerService, PARAMETERS_KEY} from './local-save-manager.service';
import { SVGStockageService } from '../../stockage-svg/svg-stockage.service';
import { LineService } from '../../stockage-svg/draw-element/line.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('LocalSaveManagerService', () => {

  let service: LocalSaveManagerService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(LocalSaveManagerService));
  beforeEach(() => service['currentDrawingParams'] = TestBed.get(DrawingManagerService));
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

});
