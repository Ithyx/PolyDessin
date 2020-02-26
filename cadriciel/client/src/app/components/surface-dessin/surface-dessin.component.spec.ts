import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { ParametresCouleurService } from 'src/app/services/couleur/color-parameter.service';
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/drawing-manager.service';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { ToolManagerService } from 'src/app/services/outils/tool-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { SurfaceDessinComponent } from './surface-dessin.component';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';

const parametresCouleurStub: Partial<ParametresCouleurService> = {
  couleurFond: undefined
}

describe('SurfaceDessinComponent', () => {
  let component: SurfaceDessinComponent;
  let tools: ToolManagerService;
  let fixture: ComponentFixture<SurfaceDessinComponent>;
  let stockage: SVGStockageService;
  let gestionnaireDessin: DrawingManagerService;
  let routingManager: RoutingManagerService;
  let routing: Router;
  let parametresCouleur: ParametresCouleurService;
  let selection: SelectionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfaceDessinComponent ],
      providers: [ {provide: ParametresCouleurService, useValue: parametresCouleurStub} ],
      imports: [ RouterModule.forRoot([]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfaceDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    stockage = TestBed.get(StockageSvgService);
    gestionnaireDessin = TestBed.get(GestionnaireDessinService);
    routingManager = TestBed.get(GestionnaireRoutingService);
    routing = TestBed.get(Router);
    parametresCouleur = TestBed.get(ParametresCouleurService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SurfaceDessinComponent devrait naviguer vers la page précédente si couleurFond est undefined', () => {
    spyOn(routing, 'navigate');
    component = new SurfaceDessinComponent(stockage, tools, gestionnaireDessin, routingManager, routing, parametresCouleur, selection);
    expect(routing.navigate).toHaveBeenCalledWith([routingManager.previousPage]);
  });
});
