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
// tslint:disable: max-file-line-count

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
    component['mousePosition'] = {x: 0, y: 0};
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
  it('#handleElementMouseDown ne devrait rien faire si l\'outil de sélection est actif et '
    + 'que le bouton de la souris ne correspond pas à un left click ni à un right click', () => {
    component.handleElementMouseDown(selectedElement, new MouseEvent('down', {button: 1}));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
  });

  // TESTS handleElementMouseUp
  it('#handleElementMouseUp ne devrait rien faire si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component, 'handleElementRightClick');
    component.handleElementMouseUp(element, new MouseEvent('up'));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleElementMouseUp ne devrait rien faire si le bouton de la souris est left click '
    + 'et que mousePosition n\'est pas égal à screenX, screenY du MouseEvent', () => {
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
  });
  it('#handleElementMouseUp devrait mettre isSelected des selectedElements à false '
    + 'lors d\'un left click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(selectedElement.isSelected).toBe(false);
  });
  it('#handleElementMouseUp devrait appeler splice pour vider selectedElements '
    + 'lors d\'un left click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    component['selection'].selectedElements.push(selectedElement);
    const spy = spyOn(component['selection'].selectedElements, 'splice');
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(spy).toHaveBeenCalledWith(0, 2);
  });
  it('#handleElementMouseUp devrait appeler push pour ajouter l\'élément aux selectedElements '
    + 'lors d\'un left click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    const spy = spyOn(component['selection'].selectedElements, 'push');
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#handleElementMouseUp devrait mettre isSelected de l\'élément en paramètre à true '
    + 'lors d\'un left click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(element.isSelected).toBe(true);
  });
  it('#handleElementMouseUp devrait appeler createBoundingBox de selection '
    + 'lors d\'un left click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    const spy = spyOn(component['selection'], 'createBoundingBox');
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 0, screenX: 25, screenY: 25}));
    expect(spy).toHaveBeenCalled();
  });
  it('#handleElementMouseUp ne devrait rien faire si le bouton de la souris est right click '
    + 'et que mousePosition n\'est pas égal à screenX, screenY du MouseEvent', () => {
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 2, screenX: 25, screenY: 25}));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
  });
  it('#handleElementMouseUp devrait appeler handleElementRightClick avec l\'élément en paramètre '
    + 'lors d\'un right click où mousePosition est égal à screenX, screenY du MouseEvent', () => {
    component['mousePosition'] = {x: 25, y: 25};
    const spy = spyOn(component, 'handleElementRightClick');
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 2, screenX: 25, screenY: 25}));
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#handleElementMouseUp ne devrait rien faire si le bouton de la souris ne correspond pas '
    + 'à un left click ni à un right click', () => {
    component['mousePosition'] = {x: 25, y: 25};
    component.handleElementMouseUp(element, new MouseEvent('up', {button: 1, screenX: 25, screenY: 25}));
    expect(component['selection'].selectedElements).toEqual([selectedElement]);
  });

  // TESTS handleElementClick
  it('#handleElementClick devrait mettre l\'élément actif de colorChanger à l\'élément en paramètre', () => {
    component.handleElementClick(element);
    expect(component['colorChanger'].activeElement).toEqual(element);
  });
  it('#handleElementClick ne devrait rien faire avec la sélection si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component['selection'], 'handleClick');
    component.handleElementClick(element);
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleElementClick devrait appeler handleClick de selection avec l\'élément en paramètre '
    + 'si l\'outil actif est la sélection', () => {
    const spy = spyOn(component['selection'], 'handleClick');
    component.handleElementClick(element);
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#handleElementClick devrait mettre clickOnSelectionBox de selection à false '
    + 'si l\'outil actif est la sélection', () => {
    component['selection'].clickOnSelectionBox = true;
    component.handleElementClick(element);
    expect(component['selection'].clickOnSelectionBox).toBe(false);
  });
  it('#handleElementClick devrait mettre clickInSelectionBox de selection à false '
    + 'si l\'outil actif est la sélection', () => {
    component['selection'].clickInSelectionBox = true;
    component.handleElementClick(element);
    expect(component['selection'].clickInSelectionBox).toBe(false);
  });

  // TESTS handleElementRightClick
  it('#handleElementRightClick devrait mettre l\'élément actif de colorChanger à l\'élément en paramètre', () => {
    component.handleElementRightClick(element);
    expect(component['colorChanger'].activeElement).toEqual(element);
  });
  it('#handleElementRightClick ne devrait rien faire avec la sélection si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component['selection'], 'handleRightClick');
    component.handleElementRightClick(element);
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleElementRightClick devrait appeler handleClick de selection avec l\'élément en paramètre '
    + 'si l\'outil actif est la sélection', () => {
    const spy = spyOn(component['selection'], 'handleRightClick');
    component.handleElementRightClick(element);
    expect(spy).toHaveBeenCalledWith(element);
  });
  it('#handleElementRightClick devrait mettre clickOnSelectionBox de selection à false '
    + 'si l\'outil actif est la sélection', () => {
    component['selection'].clickOnSelectionBox = true;
    component.handleElementRightClick(element);
    expect(component['selection'].clickOnSelectionBox).toBe(false);
  });
  it('#handleElementRightClick devrait mettre clickInSelectionBox de selection à false '
    + 'si l\'outil actif est la sélection', () => {
    component['selection'].clickInSelectionBox = true;
    component.handleElementRightClick(element);
    expect(component['selection'].clickInSelectionBox).toBe(false);
  });

  // TESTS handleMouseDownBox
  it('#handleMouseDownBox ne devrait rien faire si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    component['selection'].clickOnSelectionBox = false;
    component.handleMouseDownBox(new MouseEvent('down'));
    expect(component['selection'].clickOnSelectionBox).toBe(false);
  });
  it('#handleMouseDownBox devrait mettre clickOnSelectionBox à true si l\'outil actif est la sélection', () => {
    component['selection'].clickOnSelectionBox = false;
    component.handleMouseDownBox(new MouseEvent('down'));
    expect(component['selection'].clickOnSelectionBox).toBe(true);
  });
  it('#handleMouseDownBox devrait assigner l\'offset de la souris à mouseClick de selectionBox'
    + 'si l\'outil actif est la sélection', () => {
    component.handleMouseDownBox(new MouseEvent('down', {clientX: 12, clientY: 14}));
    expect(component['selection'].selectionBox.mouseClick).toEqual({x: 12, y: 14});
  });

  // TESTS handleMouseUpBox
  it('#handleMouseUpBox ne devrait rien faire si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component['selection'].selectionBox.selectionBox, 'translateAllPoints');
    component.handleMouseUpBox();
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleMouseUpBox devrait appeler translateAllPoints de selectionBox si l\'outil actif est la sélection', () => {
    const spy = spyOn(component['selection'].selectionBox.selectionBox, 'translateAllPoints');
    component.handleMouseUpBox();
    expect(spy).toHaveBeenCalled();
  });
  it('#handleMouseUpBox devrait appeler translateAllPoints des controlPoint si l\'outil actif est la sélection', () => {
    const controlPoint1 = new RectangleService();
    const spy1 = spyOn(controlPoint1, 'translateAllPoints');
    const controlPoint2 = new RectangleService();
    const spy2 = spyOn(controlPoint2, 'translateAllPoints');
    component['selection'].selectionBox.controlPointBox = [controlPoint1, controlPoint2];
    component.handleMouseUpBox();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // TESTS handleMouseDownBackground
  it('#handleMouseDownBackground devrait changer mousePosition pour screenX et screenY du MouseEvent', () => {
    component.handleMouseDownBackground(new MouseEvent('down', {screenX: 16, screenY: 16}));
    expect(component['mousePosition']).toEqual({x: 16, y: 16});
  });
  it('handleMouseDownBackground devrait assigner undefined à activeElement de colorChanger', () => {
    component.handleMouseDownBackground(new MouseEvent('down'));
    expect(component['colorChanger'].activeElement).not.toBeDefined();
  });
  it('#handleMouseDownBackground ne devrait rien faire avec la sélection si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component, 'handleBackgroundLeftClick');
    component.handleMouseDownBackground(new MouseEvent('down'));
    expect(spy).not.toHaveBeenCalled();
    expect(component['selection'].selectionRectangle.rectangle).toBeDefined();
  });
  it('#handleMouseDownBackground ne devrait rien faire avec la sélection si l\'outil actif est la sélection '
    + 'et que le bouton de la souris n\'est pas left click ni right click', () => {
    const spy = spyOn(component, 'handleBackgroundLeftClick');
    component.handleMouseDownBackground(new MouseEvent('down', {button: 1}));
    expect(spy).not.toHaveBeenCalled();
    expect(component['selection'].selectionRectangle.rectangle).toBeDefined();
  });
  it('handleMouseDownBackground devrait assigner l\'offset de la souris à mouseClick de selectionBox '
    + 'lors d\'un left click où clickBelongToSelectionBox est true', () => {
    spyOn(component, 'clickBelongToSelectionBox').and.returnValue(true);
    component.handleMouseDownBackground(new MouseEvent('down', {button: 0, clientX: 8, clientY: 8}));
    expect(component['selection'].selectionBox.mouseClick).toEqual({x: 8, y: 8});
  });
  it('handleMouseDownBackground devrait mettre clickInSelectionBox de selection à true '
    + 'lors d\'un left click où clickBelongToSelectionBox est true', () => {
    spyOn(component, 'clickBelongToSelectionBox').and.returnValue(true);
    component.handleMouseDownBackground(new MouseEvent('down', {button: 0}));
    expect(component['selection'].clickInSelectionBox).toBe(true);
  });
  it('handleMouseDownBackground devrait supprimer le rectangle de selectionRectangle '
    + 'lors d\'un left click où clickBelongToSelectionBox est true', () => {
    spyOn(component, 'clickBelongToSelectionBox').and.returnValue(true);
    component.handleMouseDownBackground(new MouseEvent('down', {button: 0}));
    expect(component['selection'].selectionRectangle.rectangle).not.toBeDefined();
  });
  it('handleMouseDownBackground devrait appeler handleBackgroundLeftClick '
    + 'lors d\'un left click où clickBelongToSelectionBox est false', () => {
    spyOn(component, 'clickBelongToSelectionBox').and.returnValue(false);
    const spy = spyOn(component, 'handleMouseDownBackground');
    component.handleMouseDownBackground(new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalled();
  });
  it('handleMouseDownBackground devrait appeler handleBackgroundLeftClick '
    + 'lors d\'un left click où selectionBox n\'est pas défini', () => {
    delete component['selection'].selectionBox.selectionBox;
    const spy = spyOn(component, 'handleMouseDownBackground');
    component.handleMouseDownBackground(new MouseEvent('down', {button: 0}));
    expect(spy).toHaveBeenCalled();
  });
  it('handleMouseDownBackground devrait appeler mouseDown de selectionRectangle avec le MouseEvent '
    + 'lors d\'un right click', () => {
    const spy = spyOn(component['selection'].selectionRectangle, 'mouseDown');
    const event = new MouseEvent('down', {button: 2});
    component.handleMouseDownBackground(event);
    expect(spy).toHaveBeenCalledWith(event);
  });
  it('handleMouseDownBackground devrait supprimer le rectangle de selectionRectangle '
    + 'lors d\'un right click', () => {
    component.handleMouseDownBackground(new MouseEvent('down', {button: 2}));
    expect(component['selection'].selectionRectangle.rectangle).not.toBeDefined();
  });

  // TESTS handleMouseUpBackground
  it('#handleMouseUpBackground devrait appeler handleBackgroundLeftClick si '
    + 'mousePosition est égal à screenX et screenY de la souris', () => {
    component['mousePosition'] = {x: 17, y: 17};
    const spy = spyOn(component, 'handleBackgroundLeftClick');
    component.handleMouseUpBackground(new MouseEvent('up', {screenX: 17, screenY: 17}));
    expect(spy).toHaveBeenCalled();
  });
  it('#handleMouseUpBackground ne devrait pas appeler handleBackgroundLeftClick si '
    + 'mousePosition n\'est pas égal à screenX en x', () => {
    component['mousePosition'] = {x: 15, y: 17};
    const spy = spyOn(component, 'handleBackgroundLeftClick');
    component.handleMouseUpBackground(new MouseEvent('up', {screenX: 17, screenY: 17}));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleMouseUpBackground ne devrait pas appeler handleBackgroundLeftClick si '
    + 'mousePosition n\'est pas égal à screenY en y', () => {
    component['mousePosition'] = {x: 17, y: 15};
    const spy = spyOn(component, 'handleBackgroundLeftClick');
    component.handleMouseUpBackground(new MouseEvent('up', {screenX: 17, screenY: 17}));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleMouseUpBackground ne devrait rien faire avec la sélection si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component['selection'].selectionBox.selectionBox, 'translateAllPoints');
    component.handleMouseUpBackground(new MouseEvent('up'));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleMouseUpBackground ne devrait rien faire avec la sélection '
    + 'si l\'outil actif est la sélection et selectedElements est vide', () => {
    component['selection'].selectedElements = [];
    const spy = spyOn(component['selection'].selectionBox.selectionBox, 'translateAllPoints');
    component.handleMouseUpBackground(new MouseEvent('up'));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleMouseUpBackground devrait appeler translateAllPoints de selectionBox '
    + 'si l\'outil actif est la sélection et selectedElements n\'est pas vide', () => {
    spyOn(component, 'handleBackgroundLeftClick').and.returnValue();
    const spy = spyOn(component['selection'].selectionBox.selectionBox, 'translateAllPoints');
    component.handleMouseUpBackground(new MouseEvent('up'));
    expect(spy).toHaveBeenCalled();
  });
  it('#handleMouseUpBackground devrait appeler translateAllPoints des controlPoint '
    + 'si l\'outil actif est la sélection et selectedElements n\'est pas vide', () => {
    spyOn(component, 'handleBackgroundLeftClick').and.returnValue();
    const controlPoint1 = new RectangleService();
    const spy1 = spyOn(controlPoint1, 'translateAllPoints');
    const controlPoint2 = new RectangleService();
    const spy2 = spyOn(controlPoint2, 'translateAllPoints');
    component['selection'].selectionBox.controlPointBox = [controlPoint1, controlPoint2];
    component.handleMouseUpBackground(new MouseEvent('up'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  // TESTS handleBackgroundLeftClick
  it('#handleBackgroundLeftClick devrait appeler deleteBoundingBox de selection', () => {
    const spy = spyOn(component['selection'], 'deleteBoundingBox');
    component.handleBackgroundLeftClick();
    expect(spy).toHaveBeenCalled();
  });
  it('#handleBackgroundLeftClick devrait mettre clickOnSelectionBox de selection à false', () => {
    component['selection'].clickOnSelectionBox = true;
    component.handleBackgroundLeftClick();
    expect(component['selection'].clickOnSelectionBox).toBe(false);
  });
  it('#handleBackgroundLeftClick devrait mettre clickInSelectionBox de selection à false', () => {
    component['selection'].clickInSelectionBox = true;
    component.handleBackgroundLeftClick();
    expect(component['selection'].clickInSelectionBox).toBe(false);
  });
  it('#handleBackgroundLeftClick devrait mettre isSelected des selectedElements à false', () => {
    component.handleBackgroundLeftClick();
    expect(selectedElement.isSelected).toBe(false);
  });
  it('#handleBackgroundLeftClick devrait appeler splice pour vider les selectedElements', () => {
    component['selection'].selectedElements.push(selectedElement);
    const spy = spyOn(component['selection'].selectedElements, 'splice');
    component.handleBackgroundLeftClick();
    expect(spy).toHaveBeenCalledWith(0, 2);
  });

  // TESTS handleControlPointMouseDown
  it('#handleControlPointMouseDown devrait assigner screenX et screenY de la souris à mousePosition', () => {
    component.handleControlPointMouseDown(new MouseEvent('down', {screenX: 34, screenY: 34}));
    expect(component['mousePosition']).toEqual({x: 34, y: 34});
  });
  it('#handleControlPointMouseDown ne devrait rien faire avec la sélection si l\'outil actif n\'est pas la sélection', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.COLOR_CHANGER;
    const spy = spyOn(component['selection'].selectionRectangle, 'mouseDown');
    component.handleControlPointMouseDown(new MouseEvent('down'));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleControlPointMouseDown ne devrait rien faire avec la sélection si l\'outil actif est la sélection '
    + 'et que le bouton de la souris n\'est pas un right click', () => {
    const spy = spyOn(component['selection'].selectionRectangle, 'mouseDown');
    component.handleControlPointMouseDown(new MouseEvent('down', {button: 1}));
    expect(spy).not.toHaveBeenCalled();
  });
  it('#handleControlPointMouseDown devrait appeler mouseDown de selectionRectangle avec le MouseEvent '
    + 'si l\'outil actif est la sélection et que le bouton de la souris est un right click', () => {
    const spy = spyOn(component['selection'].selectionRectangle, 'mouseDown');
    const event = new MouseEvent('down', {button: 2});
    component.handleControlPointMouseDown(event);
    expect(spy).toHaveBeenCalledWith(event);
  });
  it('#handleControlPointMouseDown devrait supprimer le rectangle de selectionRectangle '
    + 'si l\'outil actif est la sélection et que le bouton de la souris est un right click', () => {
    component.handleControlPointMouseDown(new MouseEvent('down', {button: 2}));
    expect(component['selection'].selectionRectangle.rectangle).not.toBeDefined();
  });
});
