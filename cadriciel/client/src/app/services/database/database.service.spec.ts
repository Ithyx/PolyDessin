import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { DrawElement } from '../stockage-svg/draw-element/draw-element';
import { DatabaseService, SERVER_URL } from './database.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mock: HttpTestingController;
  const elementBackup: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [],
    // isSelected: false,
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 0], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    translate: {x: 0, y: 0},
    draw: () => { return; },
    updatePosition: () => { return; },
    updatePositionMouse: () => { return; },
    updateParameters: () => { return; },
    translateAllPoints: () => { return; }
  };
  let element: DrawElement;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));
  beforeEach(() => service = TestBed.get(DatabaseService));
  beforeEach(() => mock = TestBed.get(HttpTestingController));
  beforeEach(() => element = elementBackup);

  afterEach(() => {
    mock.verify();
  });

  // TESTS constructor
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS saveDrawing
  it('#saveDrawing devrait remplacer la valeur de l\'id si celui-ci est nul', () => {
    service['drawingParams'].id = 0;
    service.saveDrawing();
    const req = mock.expectOne(SERVER_URL.POST);
    req.flush(null);
    expect(service['drawingParams'].id).not.toBe(0);
  });
  it('#saveDrawing ne devrait pas remplacer la valeur de l\'id si celui-ci n\'est pas nul', () => {
    service['drawingParams'].id = 123456;
    service.saveDrawing();
    const req = mock.expectOne(SERVER_URL.POST);
    req.flush(null);
    expect(service['drawingParams'].id).toBe(123456);
  });
  it('#saveDrawing devrait faire une requête POST au serveur avec la bonne URL', () => {
    service.saveDrawing().then((res) => expect(res).toEqual());
    const req = mock.expectOne(SERVER_URL.POST);
    expect(req.request.method).toBe('POST');
    const drawing: Drawing = {
      _id: service['drawingParams'].id,
      name: service['drawingParams'].name,
      height: service['drawingParams'].height,
      width: service['drawingParams'].width,
      backgroundColor: service['drawingParams'].backgroundColor,
      tags: service['drawingParams'].tags,
      elements: service['stockageSVG'].getCompleteSVG()
    };
    expect(req.request.body).toEqual(drawing);
    req.flush(null);
  });

  // TESTS addElement
  it('#addElement devrait appeler setupElement peut importe le type de l\'objet chargé', () => {
    const spy = spyOn(service, 'setupElement');
    for (let i = 0; i < 11; ++i) {
      element.trueType = i;
      service.addElement(element);
    }
    expect(spy).toHaveBeenCalledTimes(11);
  });

  // TESTS setupElement
  it('#setupElement devrait appeler addSVG avec une copie exacte de l\'ancien élément', () => {
    element.primaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.secondaryColor = {RGBA: [0, 0, 0, 1], RGBAString: ''};
    element.thickness = 0;
    element.thicknessLine = 0;
    element.thicknessPoint = 0;
    element.texture = '';
    element.perimeter = '';
    element.isAPoint = false;
    element.isDotted = false;
    element.chosenOption = '';
    element.isAPolygon = false;
    const spy = spyOn(service['stockageSVG'], 'addSVG');
    service.setupElement({...element}, element);
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#setupElement devrait appeller addSVG avec une copie exacte de l\'ancien élément', () => {
    element.primaryColor = undefined;
    element.secondaryColor = undefined;
    element.thickness = undefined;
    element.thicknessLine = undefined;
    element.thicknessPoint = undefined;
    element.texture = undefined;
    element.perimeter = undefined;
    element.isAPoint = undefined;
    element.isDotted = undefined;
    element.chosenOption = undefined;
    element.isAPolygon = undefined;
    const spy = spyOn(service['stockageSVG'], 'addSVG');
    service.setupElement({...element}, element);
    expect(spy).toHaveBeenCalledWith(element);
  });

  // TESTS getData
  it('#getData devrait faire une requête GET au serveur avec la bonne URL', () => {
    service.getData().then((res) => expect(res).toEqual([]));
    const req = mock.expectOne(SERVER_URL.GET);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // TESTS getDataWithTags
  it('#getDataWithTags devrait faire une requête GET au serveur avec la bonne URL', () => {
    service.getDataWithTags(['tag1', 'tag2']).then((res) => expect(res).toEqual([]));
    const req = mock.expectOne(SERVER_URL.GET + '?tags=' + encodeURIComponent(JSON.stringify(['tag1', 'tag2'])));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // TESTS deleteDrawing
  it('#deleteDrawing devrait faire une requête DELETE au serveur avec la bonne URL', () => {
    service.deleteDrawing(12345).then((res) => expect(res).toEqual());
    const req = mock.expectOne(SERVER_URL.DELETE + '?id=' + '12345');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
