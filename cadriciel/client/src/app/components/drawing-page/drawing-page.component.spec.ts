import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DrawingPageComponent } from './drawing-page.component';

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
  let component: DrawingPageComponent;
  let fixture: ComponentFixture<DrawingPageComponent>;
  let service: ToolManagerService;
  const stubOutilActif = new StubOutil();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, RouterModule.forRoot([
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
      ])],
      providers: [ {provide: ToolManagerService, useValue: GestionnaireOutilServiceStub} ],
      declarations: [ DrawingPageComponent, GuidePageComponent, ToolbarComponent,
        DrawingToolComponent, DrawingSurfaceComponent, GuideSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingPageComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ToolManagerService);
    fixture.detectChanges();
    service.toolList[0].isActive = true;
    service.toolList[1].isActive = false;
    service.activeTool = service.toolList[0];
    component.toolMap.set('stubComplet', stubOutilActif)
                           .set('stubVide', {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS RACCOURCIS CLAVIER

  it("#toucheEnfoncee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.shortcuts, 'treatInput');
    const evenement = new KeyboardEvent('keydown', {key: 'test'});
    component.onKeyDown(evenement);
    expect(component.shortcuts.treatInput).toHaveBeenCalledWith(evenement);
  });
  it("#toucheRelachee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.shortcuts, 'treatReleaseKey');
    const evenement = new KeyboardEvent('keyup', {key: 'test'});
    component.onKeyUp(evenement);
    expect(component.shortcuts.treatReleaseKey).toHaveBeenCalledWith(evenement);
  });

  // TESTS SOURIS CLIQUEE

  it("#sourisCliquee devrait appeler sourisCliquee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    const evenement = new MouseEvent('click', { clientX: 0, clientY: 0 });
    component.onClick(evenement);
    expect(stubOutilActif.onMouseClick).toHaveBeenCalledWith(evenement);
  });
  it('#sourisCliquee ne devrait rien faire si la fonction sourisCliquee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    service.activeTool = service.toolList[1];
    component.onClick(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });
  it("#sourisCliquee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    service.activeTool = service.toolList[2];
    component.onClick(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DEPLACEE

  it("#sourisDeplacee devrait appeler sourisDeplacee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    component.onMouseMove(evenement);
    expect(stubOutilActif.onMouseMove).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDeplacee ne devrait rien faire si la fonction sourisDeplacee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    service.activeTool = service.toolList[1];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });
  it("#sourisDeplacee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    service.activeTool = service.toolList[2];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENFONCEE

  it("#sourisEnfoncee devrait appeler sourisEnfoncee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMousePress');
    const evenement = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    component.onMouseDown(evenement);
    expect(stubOutilActif.onMousePress).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEnfoncee ne devrait rien faire si la fonction sourisEnfoncee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMousePress');
    service.activeTool = service.toolList[1];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });
  it("#sourisEnfoncee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMousePress');
    service.activeTool = service.toolList[2];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });

  // TESTS SOURIS RELACHEE

  it("#sourisRelachee devrait appeler sourisRelachee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    const evenement = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });
    component.onMouseUp(evenement);
    expect(stubOutilActif.onMouseRelease).toHaveBeenCalledWith(evenement);
  });
  it('#sourisRelachee ne devrait rien faire si la fonction sourisRelachee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    service.activeTool = service.toolList[1];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });
  it("#sourisRelachee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    service.activeTool = service.toolList[2];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });

  // TESTS SOURIS SORTIE

  it("#sourisSortie devrait appeler sourisSortie de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    const evenement = new MouseEvent('mouseleave', { clientX: 0, clientY: 0 });
    component.onMouseLeave(evenement);
    expect(stubOutilActif.onMouseLeave).toHaveBeenCalledWith(evenement);
  });
  it('#sourisSortie ne devrait rien faire si la fonction sourisSortie' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    service.activeTool = service.toolList[1];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });
  it("#sourisSortie ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    service.activeTool = service.toolList[2];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENTREE

  it("#sourisEntree devrait appeler sourisEntree de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    const evenement = new MouseEvent('mouseenter', { clientX: 0, clientY: 0 });
    component.onMouseEnter(evenement);
    expect(stubOutilActif.onMouseEnter).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEntree ne devrait rien faire si la fonction sourisEntree' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    service.activeTool = service.toolList[1];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });
  it("#sourisEntree ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    service.activeTool = service.toolList[2];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DOUBLE CLIC

  it("#sourisDoubleClic devrait appeler sourisDoubleClic de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    const evenement = new MouseEvent('dblclick', { clientX: 0, clientY: 0 });
    component.onDblClick(evenement);
    expect(stubOutilActif.onDoubleClick).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDoubleClic ne devrait rien faire si la fonction sourisDoubleClic' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    service.activeTool = service.toolList[1];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });
  it("#sourisDoubleClic ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    service.activeTool = service.toolList[2];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });
});
