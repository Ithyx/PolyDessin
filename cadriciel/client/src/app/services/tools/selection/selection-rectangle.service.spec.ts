import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../../stockage-svg/rectangle.service';
import { Point } from '../line-tool.service';
import { SelectionRectangleService } from './selection-rectangle.service';

describe('SelectionRectangleService', () => {
  let service: SelectionRectangleService;

  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(SelectionRectangleService));

  it('should be created', () => {
    const testService: SelectionRectangleService = TestBed.get(SelectionRectangleService);
    expect(testService).toBeTruthy();
  });

  // Tests mouseMove

  it('#mouseMove ne devrait rien faire si il n\'y a pas de sélection', () => {
    service.ongoingSelection = false;
    const oldWidthCalculated: number = service.widthCalculated;
    const oldHeightCalculated: number = service.heightCalculated;
    const oldBasisPoint: Point = service.basisPoint;
    const oldPoints: Point[] = service.rectangle.points;
    spyOn(service, 'refreshSVG');

    service.mouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

    expect(service.refreshSVG).not.toHaveBeenCalled();
    expect(service.widthCalculated).toEqual(oldWidthCalculated);
    expect(service.heightCalculated).toEqual(oldHeightCalculated);
    expect(service.basisPoint).toEqual(oldBasisPoint);
    expect(service.rectangle.points).toEqual(oldPoints);
  });

  it('#mouseMove', () => {

  });

  it('#mouseMove devrait appeler RefreshSVG s\'il y a une sélection en cours', () => {
    service.ongoingSelection = true;
    spyOn(service, 'refreshSVG');
    service.mouseMove(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(service.refreshSVG).toHaveBeenCalled();
  });

  // Tests mouseDown

  it('#mouseDown devrait créer un nouveau rectangleService', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.mouseDown(mouse);
    expect(service.rectangle).toBe(new RectangleService());
  });

  it('#mouseDown, le rectangle créé devrait être en pointillé', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.mouseDown(mouse);
    expect(service.rectangle.isDotted).toBe(true);
  });

  it('#mouseDown devrait donner à un initialPoint les coordonnées de la souris', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    const mousePoint: Point = {x: mouse.offsetX, y: mouse.offsetY};
    service.mouseDown(mouse);
    expect(service.initialPoint).toEqual(mousePoint);
  });

  it('#mouseDown devrait mettre ongoingSelection à true', () => {
    const mouse = new MouseEvent('click', { clientX: 100, clientY: 100 });
    service.mouseDown(mouse);
    expect(service.ongoingSelection).toBe(true);
  });

  // Tests mouseUp

  it('#mouseUp devrait mettre basisPoint à {0,0}', () => {
    const nullPoint: Point = {x: 0, y: 0};
    service.mouseUp();
    expect(service.basisPoint).toEqual(nullPoint);
  });

  it('#mouseUp devrait mettre widthCalculated à 0', () => {
    service.mouseUp();
    expect(service.widthCalculated).toBe(0);
  });

  it('#mouseUp devrait mettre heightCalculated à 0', () => {
    service.mouseUp();
    expect(service.heightCalculated).toBe(0);
  });

  it('#mouseUp devrait mettre ongoingSelection à false', () => {
    service.mouseUp();
    expect(service.ongoingSelection).toBe(false);
  });
});
