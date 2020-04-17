import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '../../../../../../common/communication/drawing-interface';
import { DatabaseService, SERVER_URL } from './database.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('DatabaseService', () => {
  let service: DatabaseService;
  let mock: HttpTestingController;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));
  beforeEach(() => service = TestBed.get(DatabaseService));
  beforeEach(() => mock = TestBed.get(HttpTestingController));

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
    const req = mock.expectOne(SERVER_URL.SAVE);
    req.flush(null);
    expect(service['drawingParams'].id).not.toBe(0);
  });
  it('#saveDrawing ne devrait pas remplacer la valeur de l\'id si celui-ci n\'est pas nul', () => {
    service['drawingParams'].id = 123456;
    service.saveDrawing();
    const req = mock.expectOne(SERVER_URL.SAVE);
    req.flush(null);
    expect(service['drawingParams'].id).toBe(123456);
  });
  it('#saveDrawing devrait faire une requête POST au serveur avec la bonne URL', () => {
    service.saveDrawing().then((res) => expect(res).toEqual());
    const req = mock.expectOne(SERVER_URL.SAVE);
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

  // TESTS getData
  it('#getData devrait faire une requête GET au serveur avec la bonne URL', () => {
    service.getData().then((res) => expect(res).toEqual([]));
    const req = mock.expectOne(SERVER_URL.LIST);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  // TESTS getDataWithTags
  it('#getDataWithTags devrait faire une requête GET au serveur avec la bonne URL', () => {
    service.getDataWithTags(['tag1', 'tag2']).then((res) => expect(res).toEqual([]));
    const req = mock.expectOne(SERVER_URL.LIST + '?tags=' + encodeURIComponent(JSON.stringify(['tag1', 'tag2'])));
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

  // TESTS sendEmail
  it('#sendEmail devrait faire une requête GET au serveur avec la bonne URL', () => {
    service.sendEmail('example', 'image', 'fileName', 'fileExtension').then((res) => expect(res).toEqual());
    const req = mock.expectOne(SERVER_URL.SEND);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({to: 'example', payload: 'image', filename: 'fileName', extension: 'fileExtension'});
    req.flush([]);
  });

});
