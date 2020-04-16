import { TestBed } from '@angular/core/testing';
import { SprayToolService } from '../../tools/spray-tool.service';
import { MIN_DIAMETER, SprayService } from './spray.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SprayService', () => {
  let element: SprayService;
  let service: SprayToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SprayToolService));

  beforeEach(() => {
    element = new SprayService();
    element.updateParameters(service['tools'].toolList[0]);
    element.primaryColor = {
      RGBAString: 'rgba(0, 0, 0, 1)',
      RGBA: [0, 0, 0, 1]
    };
    element.transform = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    element.points.push({x: 10, y: 10});
    element.points.push({x: 100, y: 100});
    element.diameter = 10;
    element.svg = '';
  });

  it('should be created', () => {
    const testService: SprayService = TestBed.get(SprayService);
    expect(testService).toBeTruthy();
  });

  // TESTS draw

  it('#draw devrait mettre le bon fill si erasingEvidence est faux', () => {
    let test = '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="10" cy="10" r="1" '
    + 'fill="' + element.primaryColor.RGBAString + '"></circle>';
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="100" cy="100" r="1" '
    + 'fill="' + element.primaryColor.RGBAString + '"></circle>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait mettre le bon fill si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    let test = '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="10" cy="10" r="1" '
    + 'fill="' + element.erasingColor.RGBAString + '"></circle>';
    test += '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + ')" cx="100" cy="100" r="1" '
    + 'fill="' + element.erasingColor.RGBAString + '"></circle>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  // TESTS addPoint

  it('#addPoint devrait ajouter un point au conteneur points avec diameter non nul', () => {
    const mousePosition = {x: 100, y: 100};
    const position = 0.5 * element.diameter / 2;
    const angle = 0.25 * 2 * Math.PI;
    const pointX = mousePosition.x + position * Math.cos(angle);
    const pointY = mousePosition.y + position * Math.sin(angle);
    element.points = [];
    // Le spyOn sur random a été inspiré du site
    // https://stackoverflow.com/questions/51971036/unit-testing-for-getting-random-number-in-angular-4
    spyOn(Math, 'random').and.returnValues(0.5, 0.25);
    const test = spyOn(element.points, 'push');
    element.addPoint(mousePosition);
    expect(test).toHaveBeenCalledWith({x: pointX, y: pointY});
  });

  it('#addPoint devrait ajouter un point au conteneur points avec diameter nul', () => {
    element.diameter = 0;
    const mousePosition = {x: 100, y: 100};
    const position = 0.5;
    const angle = 0.25 * 2 * Math.PI;
    const pointX = mousePosition.x + position * Math.cos(angle);
    const pointY = mousePosition.y + position * Math.sin(angle);
    element.points = [];
    spyOn(Math, 'random').and.returnValues(0.5, 0.25);
    const test = spyOn(element.points, 'push');
    element.addPoint(mousePosition);
    expect(test).toHaveBeenCalledWith({x: pointX, y: pointY});
  });

  it('#addPoint devrait mettre le bon fill si erasingEvidence est faux', () => {
    const mousePosition = {x: 100, y: 100};
    const position = 0.5 * element.diameter / 2;
    const angle = 0.25 * 2 * Math.PI;
    const pointX = mousePosition.x + position * Math.cos(angle);
    const pointY = mousePosition.y + position * Math.sin(angle);
    element.points = [];
    spyOn(Math, 'random').and.returnValues(0.5, 0.25);

    const test = '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + `)" cx="${pointX}" cy="${pointY}" r="1" `
    + `fill="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"></circle>`;
    element.addPoint(mousePosition);
    expect(element.svg).toEqual(test);
  });

  it('#addPoint devrait mettre le bon fill si erasingEvidence est vrai', () => {
    const mousePosition = {x: 100, y: 100};
    const position = 0.5 * element.diameter / 2;
    const angle = 0.25 * 2 * Math.PI;
    const pointX = mousePosition.x + position * Math.cos(angle);
    const pointY = mousePosition.y + position * Math.sin(angle);
    element.points = [];
    spyOn(Math, 'random').and.returnValues(0.5, 0.25);

    element.erasingEvidence = true;
    const test = '<circle transform=" matrix(' + element.transform.a + ' ' + element.transform.b + ' ' + element.transform.c + ' '
    + element.transform.d + ' ' + element.transform.e + ' ' + element.transform.f
    + `)" cx="${pointX}" cy="${pointY}" r="1" `
    + `fill="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"></circle>`;
    element.addPoint(mousePosition);
    expect(element.svg).toEqual(test);
  });

  // TESTS updateParameters

  it('#updateParameters devrait assigner la valeur en paramètre à diameter', () => {
    service['tools'].toolList[2].parameters[0].value = 10;
    const testTool = service['tools'].toolList[2];
    element.updateParameters(testTool);
    expect(element.diameter).toEqual(service['tools'].toolList[2].parameters[0].value);
  });

  it('#updateParameters devrait assigner 1 à diameter', () => {
    service['tools'].toolList[2].parameters[0].value = 0;
    const testTool = service['tools'].toolList[2];
    element.updateParameters(testTool);
    expect(element.diameter).toEqual(MIN_DIAMETER);
  });

});
