import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { ParametresCouleurService } from 'src/app/services/couleur/color-parameter.service';
import { GestionnaireDessinService } from 'src/app/services/gestionnaire-dessin/drawing-manager.service';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { SelectionService } from 'src/app/services/outils/selection/selection.service';
import { ToolManagerService } from 'src/app/services/outils/tool-manager.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';
import { SurfaceDessinComponent } from './surface-dessin.component';

const parametresCouleurStub: Partial<ParametresCouleurService> = {
  couleurFond: undefined
}

describe('SurfaceDessinComponent', () => {
  let component: SurfaceDessinComponent;
  let outils: ToolManagerService;
  let fixture: ComponentFixture<SurfaceDessinComponent>;
  let stockage: SVGStockageService;
  let gestionnaireDessin: GestionnaireDessinService;
  let navigation: GestionnaireRoutingService;
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
    navigation = TestBed.get(GestionnaireRoutingService);
    routing = TestBed.get(Router);
    parametresCouleur = TestBed.get(ParametresCouleurService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SurfaceDessinComponent devrait naviguer vers la page précédente si couleurFond est undefined', () => {
    spyOn(routing, 'navigate');
    component = new SurfaceDessinComponent(stockage, outils, gestionnaireDessin, navigation, routing, parametresCouleur, selection);
    expect(routing.navigate).toHaveBeenCalledWith([navigation.pagePrecedente]);
  });
});
