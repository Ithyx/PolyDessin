import { TestBed } from '@angular/core/testing';

import { DrawingManagerService } from '../drawing-manager/drawing-manager.service';
import { GridService, Line, MAX_CELL_SIZE, MIN_CELL_SIZE } from './grid.service';

describe('GridService', () => {
  let service: GridService;
  let drawing: DrawingManagerService;
  let line: Line[];
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(GridService));
  beforeEach(() => {
    drawing = new DrawingManagerService();
    service = new GridService(drawing);
    line = [];
    service.showGrid = true;
  });

  it('should be created', () => {
    const serviceTest: GridService = TestBed.get(GridService);
    expect(serviceTest).toBeTruthy();
  });

  // TESTS increaseSize

  it('#increaseSize devrait augmenter au plus proche multiple de 5 cellSize à chaque incrémentation', () => {
    // tslint:disable-next-line:no-magic-numbers
    service.cellSize = 18;
    service.increaseSize();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.cellSize).toEqual(20);
    service.increaseSize();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.cellSize).toEqual(25);
  });

  it('#increaseSize devrait s\'assurer que cellSize ne dépasse pas MAX_CELL_SIZE', () => {
    service.cellSize = MAX_CELL_SIZE - 2;
    service.increaseSize();
    expect(service.cellSize).toEqual(MAX_CELL_SIZE);
    service.increaseSize();
    expect(service.cellSize).toEqual(MAX_CELL_SIZE);
  });

  // TESTS decreaseSize

  it('#decreaseSize devrait augmenter au plus proche multiple de 5 cellSize à chaque appel de la fonction', () => {
    // tslint:disable-next-line:no-magic-numbers
    service.cellSize = 18;
    service.decreaseSize();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.cellSize).toEqual(15);
    service.decreaseSize();
    // tslint:disable-next-line:no-magic-numbers
    expect(service.cellSize).toEqual(10);
  });

  it('#decreaseSize devrait s\'assurer que cellSize ne dépasse pas MIN_CELL_SIZE', () => {
    service.cellSize = MIN_CELL_SIZE - 2;
    service.decreaseSize();
    expect(service.cellSize).toEqual(MIN_CELL_SIZE);
    service.decreaseSize();
    expect(service.cellSize).toEqual(MIN_CELL_SIZE);
  });

  // TESTS getColor

  it('#getColor devrait retourner un string de l\'opacité', () => {
    const test = service.getColor();
    expect(test).toBe('rgba(0, 0, 0, ' + service.opacity + ')');
  });

  // TESTS getLines

  it('#getLines devrait retourner un tableau line vide si showGrid est false', () => {
    service.showGrid = false;
    const test = service.getLines();
    expect(test).toEqual(line);
  });

  it('#getLines devrait créer des lignes verticales pour toute la largeur du dessin '
    + 'et horizontales pour toute la hauteur du dessin', () => {
    for (let x = service.cellSize; x < service.drawing.width; x += service.cellSize) {
      line.push({x1: x, x2: x, y1: 0, y2: service.drawing.height});
    }
    for (let y = service.cellSize; y < service.drawing.height; y += service.cellSize) {
      line.push({x1: 0, x2: service.drawing.width, y1: y, y2: y});
    }

    const test = service.getLines();
    expect(test).toEqual(line);
  });
});
