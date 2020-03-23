import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DrawingPageComponent } from './drawing-page.component';

// tslint:disable: no-string-literal

/* Service stub pour réduire les dépendances */
const outilTestActif: DrawingTool = {
  name: 'stubComplet',
  isActive: true,
  ID: 0,
  parameters: [{type: '', name: '', value: 0 }],
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
const gestionnaireOutilServiceStub: Partial<ToolManagerService> = {
  toolList: [
    outilTestActif,
    outilTestInactif,
    outilTestInexistant
  ],
  activeTool: outilTestActif
};

class StubOutil implements ToolInterface {
  onMouseMove(event: MouseEvent): void {/**/}
  onMouseRelease(event: MouseEvent): void {/**/}
  onMousePress(event: MouseEvent): void {/**/}
  onMouseClick(event: MouseEvent): void {/**/}
  onMouseLeave(event: MouseEvent): void {/**/}
  onMouseEnter(event: MouseEvent): void {/**/}
  onDoubleClick(event: MouseEvent): void {/**/}
  onRightClick(event: MouseEvent): void {/**/}
}

describe('DrawingPageComponent', () => {
  let component: DrawingPageComponent;
  let fixture: ComponentFixture<DrawingPageComponent>;
  let service: ToolManagerService;
  const stubOutilActif = new StubOutil();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatSidenavModule, MatDialogModule, RouterModule.forRoot([
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
      ])],
      providers: [ {provide: ToolManagerService, useValue: gestionnaireOutilServiceStub} ],
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
    component['toolMap'].set('stubComplet', stubOutilActif)
                           .set('stubVide', {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST onKeyDown

  it("#onKeyDown devrait passer l'event au gestionnaire de raccourcis", () => {
    spyOn(component['shortcuts'], 'treatInput');
    const event = new KeyboardEvent('keydown', {key: 'test'});
    component.onKeyDown(event);
    expect(component['shortcuts'].treatInput).toHaveBeenCalledWith(event);
  });

  // TEST onKeyUp

  it("#onKeyUp devrait passer l'event au gestionnaire de raccourcis", () => {
    spyOn(component['shortcuts'], 'treatReleaseKey');
    const event = new KeyboardEvent('keyup', {key: 'test'});
    component.onKeyUp(event);
    expect(component['shortcuts'].treatReleaseKey).toHaveBeenCalledWith(event);
  });

  // TESTS onClick

  it("#onClick devrait appeler onClick de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    const event = new MouseEvent('click', { clientX: 0, clientY: 0 });
    component.onClick(event);
    expect(stubOutilActif.onMouseClick).toHaveBeenCalledWith(event);
  });
  it('#onClick ne devrait rien faire si la fonction onClick' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    service.activeTool = service.toolList[1];
    component.onClick(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });
  it("#onClick ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseClick');
    service.activeTool = service.toolList[2];
    component.onClick(new MouseEvent('click'));
    expect(stubOutilActif.onMouseClick).not.toHaveBeenCalled();
  });

  // TESTS onMouseMove

  it("#onMouseMove devrait appeler onMouseMove de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    component.onMouseMove(event);
    expect(stubOutilActif.onMouseMove).toHaveBeenCalledWith(event);
  });
  it('#onMouseMove ne devrait rien faire si la fonction onMouseMove' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    service.activeTool = service.toolList[1];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });
  it("#onMouseMove ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseMove');
    service.activeTool = service.toolList[2];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(stubOutilActif.onMouseMove).not.toHaveBeenCalled();
  });

  // TESTS onMouseDown

  it("#onMouseDown devrait appeler onMouseDown de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMousePress');
    const event = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    component.onMouseDown(event);
    expect(stubOutilActif.onMousePress).toHaveBeenCalledWith(event);
  });
  it('#onMouseDown ne devrait rien faire si la fonction onMouseDown' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMousePress');
    service.activeTool = service.toolList[1];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });
  it("#onMouseDown ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMousePress');
    service.activeTool = service.toolList[2];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(stubOutilActif.onMousePress).not.toHaveBeenCalled();
  });

  // TESTS onMouseUp

  it("#onMouseUp devrait appeler onMouseUp de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    const event = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });
    component.onMouseUp(event);
    expect(stubOutilActif.onMouseRelease).toHaveBeenCalledWith(event);
  });
  it('#onMouseUp ne devrait rien faire si la fonction onMouseUp' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    service.activeTool = service.toolList[1];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });
  it("#onMouseUp ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseRelease');
    service.activeTool = service.toolList[2];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(stubOutilActif.onMouseRelease).not.toHaveBeenCalled();
  });

  // TESTS onMouseLeave

  it("#onMouseLeave devrait appeler onMouseLeave de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    const event = new MouseEvent('mouseleave', { clientX: 0, clientY: 0 });
    component.onMouseLeave(event);
    expect(stubOutilActif.onMouseLeave).toHaveBeenCalledWith(event);
  });
  it('#onMouseLeave ne devrait rien faire si la fonction onMouseLeave' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    service.activeTool = service.toolList[1];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });
  it("#onMouseLeave ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseLeave');
    service.activeTool = service.toolList[2];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(stubOutilActif.onMouseLeave).not.toHaveBeenCalled();
  });

  // TESTS onMouseEnter

  it("#onMouseEnter devrait appeler onMouseEnter de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    const event = new MouseEvent('mouseenter', { clientX: 0, clientY: 0 });
    component.onMouseEnter(event);
    expect(stubOutilActif.onMouseEnter).toHaveBeenCalledWith(event);
  });
  it('#onMouseEnter ne devrait rien faire si la fonction onMouseEnter' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    service.activeTool = service.toolList[1];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });
  it("#onMouseEnter ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onMouseEnter');
    service.activeTool = service.toolList[2];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(stubOutilActif.onMouseEnter).not.toHaveBeenCalled();
  });

  // TESTS onDblClick

  it("#onDblClick devrait appeler onDblClick de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    const event = new MouseEvent('dblclick', { clientX: 0, clientY: 0 });
    component.onDblClick(event);
    expect(stubOutilActif.onDoubleClick).toHaveBeenCalledWith(event);
  });
  it('#onDblClick ne devrait rien faire si la fonction onDblClick' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    service.activeTool = service.toolList[1];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });
  it("#onDblClick ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'onDoubleClick');
    service.activeTool = service.toolList[2];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(stubOutilActif.onDoubleClick).not.toHaveBeenCalled();
  });

  // TESTS onRightClick

  it("#onRightClick devrait appeler onRightClick de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'onRightClick');
    const event = new MouseEvent('contextmenu', { clientX: 0, clientY: 0 });
    component.onDblClick(event);
    expect(stubOutilActif.onRightClick).toHaveBeenCalledWith(event);
  });
  it('#onRightClick ne devrait rien faire si la fonction onRightClick de l\'outil actif n\'existe pas', () => {
    spyOn(stubOutilActif, 'onRightClick');
    service.activeTool = service.toolList[2];
    component.onDblClick(new MouseEvent('contextmenu'));
    expect(stubOutilActif.onRightClick).not.toHaveBeenCalled();
  });
});
