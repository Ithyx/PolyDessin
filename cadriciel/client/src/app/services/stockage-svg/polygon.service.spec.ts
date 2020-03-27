import { TestBed } from '@angular/core/testing';

import { DrawingTool, TOOL_INDEX } from '../tools/tool-manager.service';
import { PolygonService } from './polygon.service';

// tslint:disable: no-magic-numbers

describe('PolygonService', () => {
  let element: PolygonService;
  const tool: DrawingTool = {
    name: 'tool',
    ID: TOOL_INDEX.POLYGON,
    isActive: true,
    iconName: '',
    parameters: [
      {name: 'thickness', type: 'number', value: 15},
      {name: 'chosenOption', type: 'select', chosenOption: 'option'}
    ]
  };
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => {
    element = new PolygonService();
    element.pointMin = {x: 10, y: 10};
    element.pointMax = {x: 100, y: 100};
    element.translate = {x: 10, y: 10};
    element.chosenOption = 'Plein avec contour';
    element.erasingEvidence = false;
    element.thickness = 10;
    element.points = [{x: 50, y: 0}, {x: 100, y: 100}, {x: 0, y: 100}];
    element.primaryColor = {
      RGBA: [65, 65, 65, 1],
      RGBAString: 'rgba(65, 65, 65, 1)'
    };
    element.secondaryColor = {
      RGBA: [35, 0, 35, 1],
      RGBAString: 'rgba(35, 0, 35, 1)'
    };
    element.erasingColor = {
      RGBA: [255, 0, 0, 1],
      RGBAString: 'rgba(255, 0, 0, 1)'
    };
  });

  it('should be created', () => {
    expect(element).toBeTruthy();
  });

  // TEST getWidth
  it('#getWidth devrait retourner la différence en x entre pointMin et pointMax', () => {
    expect(element.getWidth()).toEqual(90);
  });

  // TEST getHeight
  it('#getWidth devrait retourner la différence en y entre pointMin et pointMax', () => {
    expect(element.getWidth()).toEqual(90);
  });

  // TESTS draw
  it('#draw devrait appeler drawPolygon', () => {
    const spy = spyOn(element, 'drawPolygon');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });
  it('#draw devrait appeler drawPerimeter', () => {
    const spy = spyOn(element, 'drawPerimeter');
    element.draw();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS drawPolygon
  it('#drawPolygon devrait attribuer le bon svg au polygone', () => {
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="rgba(35, 0, 35, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawPolygon();
    expect(element.svg).toEqual(svg);
  });
  it('#drawPolygon devrait attribuer le bon svg au polygone si chosenOption est Contour', () => {
    element.chosenOption = 'Contour';
    let svg = '<polygon transform=" translate(10 10)" fill="none" stroke="rgba(35, 0, 35, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawPolygon();
    expect(element.svg).toEqual(svg);
  });
  it('#drawPolygon devrait attribuer le bon svg au polygone si erasingEvidence est vrai', () => {
    element.erasingEvidence = true;
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="rgba(255, 0, 0, 1)" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawPolygon();
    expect(element.svg).toEqual(svg);
  });
  it('#drawPolygon devrait attribuer le bon svg au polygone si chosenOption est Plein', () => {
    element.chosenOption = 'Plein';
    let svg = '<polygon transform=" translate(10 10)" fill="rgba(65, 65, 65, 1)" stroke="none" ';
    svg += 'stroke-width="10" points="50 0 100 100 0 100 "></polygon>';
    element.drawPolygon();
    expect(element.svg).toEqual(svg);
  });

  // TESTS drawPerimeter
  it('#drawPerimeter devrait attribuer le bon svg au périmètre si chosenOption est Plein', () => {
    element.chosenOption = 'Plein';
    let svg = '<rect stroke="gray" fill="none" stroke-width="2" ';
    svg += 'x="10" y="10" height="90" width="90"/>';
    element.drawPerimeter();
    expect(element.perimeter).toEqual(svg);
  });
  it('#drawPerimeter devrait attribuer le bon svg au périmètre si chosenOption n\'est pas Plein', () => {
    let svg = '<rect stroke="gray" fill="none" stroke-width="2" ';
    svg += 'x="5" y="5" height="100" width="100"/>';
    element.drawPerimeter();
    expect(element.perimeter).toEqual(svg);
  });

  // TESTS updatePosition
  it('#updatePosition devrait attribuer les valeurs en paramètre à translation', () => {
    element.translate = {x: 90, y: 90};
    element.updatePosition(10, 10);
    expect(element.translate).toEqual({x: 100, y: 100});
  });
  it('#updatePosition devrait appeler la fonction draw', () => {
    spyOn(element, 'draw');
    element.updatePosition(10, 10);
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updatePositionMouse
  it('#updatePositionMouse devrait attribuer les valeurs en paramètre à translation', () => {
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, {x: 10, y: 10});
    expect(element.translate).toEqual({x: 90, y: 90});
  });
  it('#updatePositionMouse devrait appeler la fonction draw', () => {
    spyOn(element, 'draw');
    const click = new MouseEvent('click', { clientX: 100, clientY: 100 });
    element.updatePositionMouse(click, {x: 10, y: 10});
    expect(element.draw).toHaveBeenCalled();
  });

  // TESTS updateParameters
  it('#updateParameters devrait attribuer les valeurs de l\'outil en paramètre à thickness s\'il en a une', () => {
    tool.parameters[0].value = 15;
    element.updateParameters(tool);
    expect(element.thickness).toEqual(15);
  });
  it('#updateParameters devrait assigner 1 à thickness si l\'outil en paramètre n\'en a pas', () => {
    delete tool.parameters[0].value;
    element.updateParameters(tool);
    expect(element.thickness).toEqual(1);
  });
  it('#updateParameters devrait assigner chosenOption en paramètre à chosenOption', () => {
    tool.parameters[1].chosenOption = 'option';
    element.updateParameters(tool);
    expect(element.chosenOption).toEqual('option');
  });
  it('#updateParameters devrait assigner une chaine de caractère vide à chosenOption si l\'outil en paramètre n\'en a pas', () => {
    delete tool.parameters[1].chosenOption;
    element.updateParameters(tool);
    expect(element.chosenOption).toEqual('');
  });

  // TESTS translateAllPoints
  it('#translateAllPoints devrait changer tous les points de points pour ajouter la translation', () => {
    element.points = [];
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
