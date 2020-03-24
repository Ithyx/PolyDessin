import { TestBed } from '@angular/core/testing';

import { RectangleService } from '../stockage-svg/rectangle.service';
import { EraserToolService } from './eraser-tool.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: max-file-line-count

describe('EraserToolService', () => {
  let service: EraserToolService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    service = TestBed.get(EraserToolService);
    service['drawing'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['thickness'] = 10;
    service['square'] = new DOMRect();
    service['square'].x = 10;
    service['square'].y = 10;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTS makeSquare

  it('#makeSquare devrait appeler createSVGRect de SVGSVGElement pour créer le carré de l\'efface', () => {
    const spy = spyOn(SVGSVGElement.prototype, 'createSVGRect').and.returnValue(new DOMRect());
    service.makeSquare(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('#makeSquare devrait assigner la coordonnée en x du point supérieur gauche à square.x', () => {
    service.makeSquare(new MouseEvent('click', {clientX: 100, clientY: 100}));
    expect(service['square'].x).toBe(95);
  });

  it('#makeSquare devrait assigner la coordonnée en y du point supérieur gauche à square.y', () => {
    service.makeSquare(new MouseEvent('click', {clientX: 100, clientY: 100}));
    expect(service['square'].y).toBe(95);
  });

  it('#makeSquare devrait assigner thickness à square.width', () => {
    service['thickness'] = 35;
    service.makeSquare(new MouseEvent('click'));
    expect(service['square'].width).toBe(35);
  });

  it('#makeSquare devrait assigner thickness à square.height', () => {
    service['thickness'] = 45;
    service.makeSquare(new MouseEvent('click'));
    expect(service['square'].height).toBe(45);
  });

  it('#makeSquare devrait appeler setOngoingSVG de svgStockage avec l\'efface', () => {
    const spy = spyOn(service['svgStockage'], 'setOngoingSVG');
    service.makeSquare(new MouseEvent('click', {clientX: 50, clientY: 60}));
    const eraser = new RectangleService();
    eraser.svg =
      '<rect class="eraser" x="45" y="55" width="10" height="10" stroke="rgba(0, 0, 0, 1)" fill="white" stroke-width="1"></rect>';
    eraser.svgHtml = service['sanitizer'].bypassSecurityTrustHtml(eraser.svg);
    expect(spy).toHaveBeenCalledWith(eraser);
  });

  // TESTS belongsToSquare

  it('#belongsToSquare devrait retourner false si le point en x est inférieur au x du carré', () => {
    expect(service.belongsToSquare({x: 5, y: 15})).toBe(false);
  });

  it('#belongsToSquare devrait retourner false si le point en y est inférieur au y du carré', () => {
    expect(service.belongsToSquare({x: 15, y: 5})).toBe(false);
  });

  it('#belongsToSquare devrait retourner false si le point en x est supérieur au x du carré plus l\'épaisseur', () => {
    expect(service.belongsToSquare({x: 25, y: 15})).toBe(false);
  });

  it('#belongsToSquare devrait retourner false si le point en y est supérieur au y du carré plus l\'épaisseur', () => {
    expect(service.belongsToSquare({x: 15, y: 25})).toBe(false);
  });

  it('#belongsToSquare devrait retourner true si le point se trouve à l\'intérieur du carré', () => {
    expect(service.belongsToSquare({x: 15, y: 15})).toBe(true);
  });
});
