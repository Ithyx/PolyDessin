import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { SelectionService } from 'src/app/services/tools/selection/selection.service';
import { ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { DrawingSurfaceComponent } from './drawing-surface.component';

const parametresCouleurStub: Partial<ColorParameterService> = {
  temporaryBackgroundColor: undefined
};

describe('SurfaceDessinComponent', () => {
  let component: DrawingSurfaceComponent;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;
  let stockage: SVGStockageService;
  let gestionnaireDessin: DrawingManagerService;
  let routingManager: RoutingManagerService;
  let routing: Router;
  let parametresCouleur: ColorParameterService;
  let tools: ToolManagerService;
  let selection: SelectionService;
  let grid: GridService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingSurfaceComponent ],
      providers: [ {provide: ColorParameterService, useValue: parametresCouleurStub} ],
      imports: [ RouterModule.forRoot([]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    stockage = TestBed.get(SVGStockageService);
    gestionnaireDessin = TestBed.get(DrawingManagerService);
    routingManager = TestBed.get(RoutingManagerService);
    routing = TestBed.get(Router);
    parametresCouleur = TestBed.get(ColorParameterService);
    tools = TestBed.get(ToolManagerService);
    selection = TestBed.get(SelectionService);
    grid = TestBed.get(GridService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SurfaceDessinComponent devrait naviguer vers la page précédente si couleurFond est undefined', () => {
    spyOn(routing, 'navigate');
    component = new DrawingSurfaceComponent(stockage, tools, gestionnaireDessin, routingManager,
                                            routing, parametresCouleur, selection, grid);
    expect(routing.navigate).toHaveBeenCalledWith([routingManager.previousPage]);
  });
});
