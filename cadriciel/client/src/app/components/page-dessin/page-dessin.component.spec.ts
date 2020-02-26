import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ToolManagerService, DrawingTool } from 'src/app/services/outils/tool-manager.service';
import { ToolInterface } from 'src/app/services/outils/tool-interface';
import { BarreOutilsComponent } from '../barre-outils/barre-outils.component';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { SurfaceDessinComponent } from '../surface-dessin/surface-dessin.component';
import { PageDessinComponent } from './page-dessin.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: DrawingTool = {
  name: 'stubComplet',
  isActive: true,
  ID: 0,
  parameters: [],
  iconName: ''
};
const outilTestInactif: DrawingTool = {
  name: 'stubVide',
  isActive: false,
  ID: 1,
  parameters: [],
  iconName: ''
};
const outilTestInexistant: DrawingTool = {
  name: 'stubInexistant',
  isActive: false,
  ID: 2,
  parameters: [],
  iconName: ''
};
const GestionnaireOutilServiceStub: Partial<ToolManagerService> = {
  toolList: [
    outilTestActif,
    outilTestInactif,
    outilTestInexistant
  ],
  activeTool: outilTestActif
}
class StubOutil implements ToolInterface {
  onMouseMove(evenement: MouseEvent) {/**/}
  onMouseRelease(evenement: MouseEvent) {/**/}
  onMousePress(evenement: MouseEvent) {/**/}
  onMouseClick(evenement: MouseEvent) {/**/}
  onMouseLeave(evenement: MouseEvent) {/**/}
  onMouseEnter(evenement: MouseEvent) {/**/}
  onDoubleClick(evenement: MouseEvent) {/**/}
}

describe('PageDessinComponent', () => {
  let component: PageDessinComponent;
  let fixture: ComponentFixture<PageDessinComponent>;
  let service: ToolManagerService;
  const stubOutilActif = new StubOutil();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, RouterModule.forRoot([
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
      ])],
      providers: [ {provide: ToolManagerService, useValue: GestionnaireOutilServiceStub} ],
      declarations: [ PageDessinComponent, PageGuideComponent, BarreOutilsComponent,
        OutilDessinComponent, SurfaceDessinComponent, GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDessinComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ToolManagerService);
    fixture.detectChanges();
    service.toolList[0].isActive = true;
    service.toolList[1].isActive = false;
    service.activeTool = service.toolList[0];
    component.lexiqueOutils.set('stubComplet', stubOutilActif)
                           .set('stubVide', {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS RACCOURCIS CLAVIER

  it("#toucheEnfoncee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.raccourcis, 'traiterInput');
    const evenement = new KeyboardEvent('keydown', {key: 'test'});
    component.toucheEnfoncee(evenement);
    expect(component.raccourcis.traiterInput).toHaveBeenCalledWith(evenement);
  });
  it("#toucheRelachee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.raccourcis, 'traiterToucheRelachee');
    const evenement = new KeyboardEvent('keyup', {key: 'test'});
    component.toucheRelachee(evenement);
    expect(component.raccourcis.traiterToucheRelachee).toHaveBeenCalledWith(evenement);
  });

  // TESTS SOURIS CLIQUEE

  it("#sourisCliquee devrait appeler sourisCliquee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    const evenement = new MouseEvent('click', { clientX: 0, clientY: 0 });
    component.sourisCliquee(evenement);
    expect(stubOutilActif.onMouseClick).toHaveBeenCalledWith(evenement);
  });
  it('#sourisCliquee ne devrait rien faire si la fonction sourisCliquee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    service.activeTool = service.toolList[1];
    component.sourisCliquee(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });
  it("#sourisCliquee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    service.activeTool = service.toolList[2];
    component.sourisCliquee(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DEPLACEE

  it("#sourisDeplacee devrait appeler sourisDeplacee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    component.sourisDeplacee(evenement);
    expect(stubOutilActif.onMouseMove).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDeplacee ne devrait rien faire si la fonction sourisDeplacee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    service.activeTool = service.toolList[1];
    component.sourisDeplacee(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });
  it("#sourisDeplacee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    service.activeTool = service.toolList[2];
    component.sourisDeplacee(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENFONCEE

  it("#sourisEnfoncee devrait appeler sourisEnfoncee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    const evenement = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    component.sourisEnfoncee(evenement);
    expect(stubOutilActif.onMousePress).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEnfoncee ne devrait rien faire si la fonction sourisEnfoncee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    service.activeTool = service.toolList[1];
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });
  it("#sourisEnfoncee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    service.activeTool = service.toolList[2];
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });

  // TESTS SOURIS RELACHEE

  it("#sourisRelachee devrait appeler sourisRelachee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    const evenement = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });
    component.sourisRelachee(evenement);
    expect(stubOutilActif.onMouseRelease).toHaveBeenCalledWith(evenement);
  });
  it('#sourisRelachee ne devrait rien faire si la fonction sourisRelachee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    service.activeTool = service.toolList[1];
    component.sourisRelachee(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });
  it("#sourisRelachee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    service.activeTool = service.toolList[2];
    component.sourisRelachee(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });

  // TESTS SOURIS SORTIE

  it("#sourisSortie devrait appeler sourisSortie de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    const evenement = new MouseEvent('mouseleave', { clientX: 0, clientY: 0 });
    component.sourisSortie(evenement);
    expect(stubOutilActif.onMouseLeave).toHaveBeenCalledWith(evenement);
  });
  it('#sourisSortie ne devrait rien faire si la fonction sourisSortie' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    service.activeTool = service.toolList[1];
    component.sourisSortie(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });
  it("#sourisSortie ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    service.activeTool = service.toolList[2];
    component.sourisSortie(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENTREE

  it("#sourisEntree devrait appeler sourisEntree de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    const evenement = new MouseEvent('mouseenter', { clientX: 0, clientY: 0 });
    component.sourisEntree(evenement);
    expect(stubOutilActif.onMouseEnter).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEntree ne devrait rien faire si la fonction sourisEntree' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    service.activeTool = service.toolList[1];
    component.sourisEntree(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });
  it("#sourisEntree ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    service.activeTool = service.toolList[2];
    component.sourisEntree(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DOUBLE CLIC

  it("#sourisDoubleClic devrait appeler sourisDoubleClic de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    const evenement = new MouseEvent('dblclick', { clientX: 0, clientY: 0 });
    component.sourisDoubleClic(evenement);
    expect(stubOutilActif.onDoubleClick).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDoubleClic ne devrait rien faire si la fonction sourisDoubleClic' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    service.activeTool = service.toolList[1];
    component.sourisDoubleClic(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });
  it("#sourisDoubleClic ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    service.activeTool = service.toolList[2];
    component.sourisDoubleClic(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });
});
