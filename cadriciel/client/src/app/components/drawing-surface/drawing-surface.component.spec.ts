import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ElementRef } from '@angular/core';
import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element';
import { LineService } from 'src/app/services/stockage-svg/line.service';
import { RectangleService } from 'src/app/services/stockage-svg/rectangle.service';
import { SelectionBoxService } from 'src/app/services/tools/selection/selection-box.service';
import { SelectionRectangleService } from 'src/app/services/tools/selection/selection-rectangle.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { DrawingTool, TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { DrawingSurfaceComponent } from './drawing-surface.component';

// tslint:disable: no-string-literal

const parametresCouleurStub: Partial<ColorParameterService> = {
  temporaryBackgroundColor: undefined
};

describe('SurfaceDessinComponent', () => {
  let component: DrawingSurfaceComponent;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;
  let drawing: SVGElement;
  let canvas: HTMLCanvasElement;
  const element: DrawElement = new RectangleService();
  const selectedElement: DrawElement = new LineService();

  const selectionBoxStub: Partial<SelectionBoxService> = {
    selectionBox: new RectangleService(),
    mouseClick: {x: 0, y: 0},
    controlPointBox: []
  };

  const selectionRectangleStub: Partial<SelectionRectangleService> = {
    rectangle: new RectangleService(),
    mouseDown: () => { return; }
  };

  const selectionStub: Partial<SelectionService> = {
    selectionBox: selectionBoxStub as SelectionBoxService,
    selectionRectangle: selectionRectangleStub as SelectionRectangleService,
    selectedElements: [selectedElement],
    createBoundingBox: () => { return; },
    deleteBoundingBox: () => { return; },
    handleClick: () => { return; },
    handleRightClick: () => { return; },
    clickInSelectionBox: false,
    clickOnSelectionBox: false
  };

  const activeToolTest: DrawingTool = {
    name: 'stubActive',
    isActive: true,
    ID: TOOL_INDEX.SELECTION,
    parameters: [{type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
                 {type: 'select', name: 'Type', options: ['A', 'B'], chosenOption: 'A'}],
    iconName: ''
  };

  const toolManagerStub: Partial<ToolManagerService> = {
    toolList: [
      activeToolTest
    ],
    activeTool: activeToolTest
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingSurfaceComponent ],
      providers: [ {provide: ColorParameterService, useValue: parametresCouleurStub},
                   {provide: SelectionService, useValue: selectionStub},
                   {provide: SelectionBoxService, useValue: selectionBoxStub},
                   {provide: SelectionRectangleService, useValue: selectionRectangleStub},
                   {provide: ToolManagerService, useValue: toolManagerStub} ],
      imports: [ RouterModule.forRoot([]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    drawing = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    component['drawing'] = new ElementRef<SVGElement>(drawing);
    canvas = document.createElement('canvas');
    component['canvas'] = new ElementRef<HTMLCanvasElement>(canvas);
    component['selection'] = TestBed.get(SelectionService);
    component['selection'].selectionBox.selectionBox = new RectangleService();
    component['selection'].selectionBox.selectionBox.points[0] = {x: 10, y: 10};
    component['selection'].selectionBox.selectionBox.points[1] = {x: 20, y: 20};
    component['selection'].selectionRectangle.rectangle = new RectangleService();
    selectedElement.isSelected = true;
    element.isSelected = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngAfterViewInit

  it('#ngAfterViewInit devrait assigner le nativeElement de drawing au drawing de eraser', () => {
    component.ngAfterViewInit();
    expect(component['eraser'].drawing).toEqual(drawing);
  });

  it('#ngAfterViewInit devrait assigner le nativeElement de drawing au drawing de pipette', () => {
    component.ngAfterViewInit();
    expect(component['pipette'].drawing).toEqual(drawing);
  });

  it('#ngAfterViewInit devrait assigner le nativeElement de canvas au canvas de canvasConversion', () => {
    component.ngAfterViewInit();
    expect(component['canvasConversion'].canvas).toEqual(canvas);
  });

  it('#ngAfterViewInit devrait assigner le nativeElement de canvas au canvas de pipette', () => {
    component.ngAfterViewInit();
    expect(component['pipette'].canvas).toEqual(canvas);
  });

  // TESTS clickBelongToSelectionBox

  it('#clickBelongToSelectionBox devrait retourner false si le x de la souris est inférieur '
    + 'au x minimal de la boîte de sélection', () => {
    expect(component.clickBelongToSelectionBox(new MouseEvent('click', {clientX: 5, clientY: 15}))).toBe(false);
  });

  it('#clickBelongToSelectionBox devrait retourner false si le x de la souris est supérieur '
    + 'au x maximal de la boîte de sélection', () => {
    expect(component.clickBelongToSelectionBox(new MouseEvent('click', {clientX: 25, clientY: 15}))).toBe(false);
  });

  it('#clickBelongToSelectionBox devrait retourner false si le y de la souris est inférieur '
    + 'au y minimal de la boîte de sélection', () => {
    expect(component.clickBelongToSelectionBox(new MouseEvent('click', {clientX: 15, clientY: 5}))).toBe(false);
  });

  it('#clickBelongToSelectionBox devrait retourner false si le y de la souris est supérieur '
    + 'au y maximal de la boîte de sélection', () => {
    expect(component.clickBelongToSelectionBox(new MouseEvent('click', {clientX: 15, clientY: 25}))).toBe(false);
  });

  it('#clickBelongToSelectionBox devrait retourner false si le clic de la souris est contenu '
    + 'dans la boîte de sélection', () => {
    expect(component.clickBelongToSelectionBox(new MouseEvent('click', {clientX: 15, clientY: 15}))).toBe(true);
  });

  // TESTS handleElementMouseDown

  it('#handleElementMouseDown devrait assigner l\'élément en paramètre à activeElement de colorChanger', () => {
    component.handleElementMouseDown(element, new MouseEvent('down'));
    expect(component['colorChanger'].activeElement).toEqual(element);
  });

  it('#handleElementMouseDown devrait assigner mouse.screenX et mouse.screenY à mousePosition', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {screenX: 45, screenY: 65}));
    expect(component['mousePosition']).toEqual({x: 45, y: 65});
  });

  it('#handleElementMouseDown ne devrait rien faire si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    component.handleElementMouseDown(element, new MouseEvent('down'));
    expect(component['selection'].selectionRectangle.rectangle).toBeDefined();
  });

  it('#handleElementMouseDown devrait tester si selectedElements inclut l\'élément en paramètre '
    + 'si le click est un left click', () => {
    const spy = spyOn(component['selection'].selectedElements, 'includes');
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalledWith(element);
  });

  it('#handleElementMouseDown devrait mettre isSelected des selectedElements à false '
    + 'si selectedElements n\'inclut pas l\'élément en paramètre', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(selectedElement.isSelected).toBe(false);
  });

  it('#handleElementMouseDown devrait appeler splice pour vider selectedElements '
    + 'si selectedElements n\'inclut pas l\'élément en paramètre', () => {
    component['selection'].selectedElements.push(selectedElement);
    const spy = spyOn(component['selection'].selectedElements, 'splice');
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalledWith(0, 2);
  });

  it('#handleElementMouseDown devrait appeler push pour ajouter l\'élément à selectedElements '
    + 'si selectedElements n\'inclut pas l\'élément en paramètre', () => {
    const spy = spyOn(component['selection'].selectedElements, 'push');
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalledWith(element);
  });

  it('#handleElementMouseDown devrait mettre isSelected de l\'élément à true '
    + 'si selectedElements n\'inclut pas l\'élément en paramètre', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(element.isSelected).toBe(true);
  });

  it('#handleElementMouseDown devrait appeler createBoundingBox de selection '
    + 'si selectedElements n\'inclut pas l\'élément en paramètre', () => {
    const spy = spyOn(component['selection'], 'createBoundingBox');
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalled();
  });

  it('#handleElementMouseDown ne devrait pas modifier selectedElements '
    + 'si selectedElements inclut pas l\'élément en paramètre', () => {
    component.handleElementMouseDown(selectedElement, new MouseEvent('down', {button: 0}));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
  });

  it('#handleElementMouseDown devrait modifier le mouseClick de selectionBox avec le offset de la souris '
    + 'si le bouton de la souris est left click', () => {
    component['selection'].selectionBox.mouseClick = {x: 0, y: 0};
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0, clientX: 50, clientY: 50}));
    expect(component['selection'].selectionBox.mouseClick).toEqual({x: 50, y: 50});
  });

  it('#handleElementMouseDown devrait supprimer rectangle de selectionRectangle '
    + 'si le bouton de la souris est left click', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(component['selection'].selectionRectangle.rectangle).not.toBeDefined();
  });

  it('#handleElementMouseDown devrait mettre clickInSelectionBox de selection à true '
    + 'si le bouton de la souris est left click', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 0}));
    expect(component['selection'].clickInSelectionBox).toBe(true);
  });

  it('#handleElementMouseDown devrait appeler mouseDown de selectionRectangle avec le MouseEvent '
    + 'si le bouton de la souris est right click', () => {
    const spy = spyOn(component['selection'].selectionRectangle, 'mouseDown');
    const event = new MouseEvent('down', {button: 2});
    component.handleElementMouseDown(element, event);
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('#handleElementMouseDown devrait supprimer rectangle de selectionRectangle '
    + 'si le bouton de la souris est right click', () => {
    component.handleElementMouseDown(element, new MouseEvent('down', {button: 2}));
    expect(component['selection'].selectionRectangle.rectangle).not.toBeDefined();
  });
});
