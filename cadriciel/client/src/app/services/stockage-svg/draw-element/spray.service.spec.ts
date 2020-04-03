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
    element.translate = { x: 10, y: 10};
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
    let test = '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
    + ')" cx="10" cy="10" r="1" '
    + 'fill="' + element.primaryColor.RGBAString + '"></circle>';
    test += '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
    + ')" cx="100" cy="100" r="1" '
    + 'fill="' + element.primaryColor.RGBAString + '"></circle>';
    element.draw();
    expect(element.svg).toEqual(test);
  });

  it('#draw devrait mettre le bon fill si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    let test = '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
    + ')" cx="10" cy="10" r="1" '
    + 'fill="' + element.erasingColor.RGBAString + '"></circle>';
    test += '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
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

    const test = '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
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
    const test = '<circle transform="translate(' + element.translate.x + ' ' + element.translate.y
    + `)" cx="${pointX}" cy="${pointY}" r="1" `
    + `fill="${(element.erasingEvidence) ? element.erasingColor.RGBAString :  element.primaryColor.RGBAString}"></circle>`;
    element.addPoint(mousePosition);
    expect(element.svg).toEqual(test);
  });

  // TESTS updatePosition

  it('#updatePosition devrait ajouter les valeurs en paramètre à translate', () => {
    element.updatePosition(10, -25);
    expect(element.translate.x).toEqual(20);
    expect(element.translate.y).toEqual(-15);
  });

  it('#updatePosition devrait appeler draw', () => {
    spyOn(element, 'draw');
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse

  it('#updatePositionMouse devrait ajouter les valeurs en paramètre à translate', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.translate.x).toEqual(90);
    expect(element.translate.y).toEqual(90);
  });

  it('#updatePositionMouse devrait appeler draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, { x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
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

  // TESTS translateAllPoints

  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
    element.points.push({x: 10, y: 10});
    element.translateAllPoints();
    expect(element.points[0].x).toEqual(20);
    expect(element.points[0].y).toEqual(20);
  });

  it('#translateAllPoints devrait mettre translation à 0', () => {
    element.translateAllPoints();
    expect(element.translate).toEqual({x: 0, y: 0});
  });
});
