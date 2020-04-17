import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { LocalSaveManagerService } from 'src/app/services/saving/local/local-save-manager.service';
import { ToolInterface } from 'src/app/services/tools/tool-interface';
import { DrawingTool, TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { AttributesPanelComponent } from '../attributes-panel/attributes-panel.component';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DrawingPageComponent } from './drawing-page.component';

// tslint:disable: no-string-literal

/* Service stub pour réduire les dépendances */
const activeToolTest: DrawingTool = {
  name: 'complete',
  isActive: true,
  ID: 0,
  parameters: [{type: '', name: '', value: 0 }],
  iconName: ''
};
const inactiveToolTest: DrawingTool = {
  name: 'empty',
  isActive: false,
  ID: 1,
  parameters: [],
  iconName: ''
};
const absentToolTest: DrawingTool = {
  name: 'absent',
  isActive: false,
  ID: 2,
  parameters: [],
  iconName: ''
};
const toolManagerStub: Partial<ToolManagerService> = {
  toolList: [
    activeToolTest,
    inactiveToolTest,
    absentToolTest
  ],
  activeTool: activeToolTest
};

class ToolStub implements ToolInterface {
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
  const activeToolStub = new ToolStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatSidenavModule, MatDialogModule, RouterModule.forRoot([
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
      ])],
      providers: [ {provide: ToolManagerService, useValue: toolManagerStub} ],
      declarations: [ DrawingPageComponent, GuidePageComponent, ToolbarComponent,
        DrawingToolComponent, DrawingSurfaceComponent, GuideSubjectComponent, AttributesPanelComponent ]
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
    component['toolMap'].set('complete', activeToolStub)
                        .set('empty', {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS constructeur

  it('#constructor devrait appeler loadState de localSaving si isStorageEmpty est faux', () => {
    spyOn(LocalSaveManagerService.prototype, 'isStorageEmpty').and.returnValue(false);
    const spy = spyOn(LocalSaveManagerService.prototype, 'loadState');
    TestBed.createComponent(DrawingPageComponent);
    expect(spy).toHaveBeenCalled();
  });

  it('#constructor ne devrait pas appeler loadState de localSaving si isStorageEmpty est vrai', () => {
    spyOn(LocalSaveManagerService.prototype, 'isStorageEmpty').and.returnValue(true);
    const spy = spyOn(LocalSaveManagerService.prototype, 'loadState');
    TestBed.createComponent(DrawingPageComponent);
    expect(spy).not.toHaveBeenCalled();
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
    spyOn(activeToolStub, 'onMouseClick');
    const event = new MouseEvent('click', { clientX: 0, clientY: 0 });
    component.onClick(event);
    expect(activeToolStub.onMouseClick).toHaveBeenCalledWith(event);
  });
  it('#onClick ne devrait rien faire si la fonction onClick' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMouseClick');
    service.activeTool = service.toolList[1];
    component.onClick(new MouseEvent('click'));
    expect(activeToolStub.onMouseClick).not.toHaveBeenCalled();
  });
  it("#onClick ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMouseClick');
    service.activeTool = service.toolList[2];
    component.onClick(new MouseEvent('click'));
    expect(activeToolStub.onMouseClick).not.toHaveBeenCalled();
  });

  // TESTS onMouseMove

  it("#onMouseMove devrait appeler onMouseMove de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onMouseMove');
    const event = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    component.onMouseMove(event);
    expect(activeToolStub.onMouseMove).toHaveBeenCalledWith(event);
  });
  it('#onMouseMove ne devrait rien faire si la fonction onMouseMove' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMouseMove');
    service.activeTool = service.toolList[1];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(activeToolStub.onMouseMove).not.toHaveBeenCalled();
  });
  it("#onMouseMove ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMouseMove');
    service.activeTool = service.toolList[2];
    component.onMouseMove(new MouseEvent('mousemove'));
    expect(activeToolStub.onMouseMove).not.toHaveBeenCalled();
  });

  // TESTS onMouseDown

  it("#onMouseDown devrait appeler onMouseDown de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onMousePress');
    const event = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    component.onMouseDown(event);
    expect(activeToolStub.onMousePress).toHaveBeenCalledWith(event);
  });
  it('#onMouseDown ne devrait rien faire si la fonction onMouseDown' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMousePress');
    service.activeTool = service.toolList[1];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(activeToolStub.onMousePress).not.toHaveBeenCalled();
  });
  it("#onMouseDown ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMousePress');
    service.activeTool = service.toolList[2];
    component.onMouseDown(new MouseEvent('mousedown'));
    expect(activeToolStub.onMousePress).not.toHaveBeenCalled();
  });

  // TESTS onMouseUp

  it("#onMouseUp devrait appeler onMouseUp de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onMouseRelease');
    const event = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });
    component.onMouseUp(event);
    expect(activeToolStub.onMouseRelease).toHaveBeenCalledWith(event);
  });
  it('#onMouseUp ne devrait rien faire si la fonction onMouseUp' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMouseRelease');
    service.activeTool = service.toolList[1];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(activeToolStub.onMouseRelease).not.toHaveBeenCalled();
  });
  it("#onMouseUp ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMouseRelease');
    service.activeTool = service.toolList[2];
    component.onMouseUp(new MouseEvent('mouseup'));
    expect(activeToolStub.onMouseRelease).not.toHaveBeenCalled();
  });

  // TESTS onMouseLeave

  it("#onMouseLeave devrait appeler onMouseLeave de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onMouseLeave');
    const event = new MouseEvent('mouseleave', { clientX: 0, clientY: 0 });
    component.onMouseLeave(event);
    expect(activeToolStub.onMouseLeave).toHaveBeenCalledWith(event);
  });
  it('#onMouseLeave ne devrait rien faire si la fonction onMouseLeave' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMouseLeave');
    service.activeTool = service.toolList[1];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(activeToolStub.onMouseLeave).not.toHaveBeenCalled();
  });
  it("#onMouseLeave ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMouseLeave');
    service.activeTool = service.toolList[2];
    component.onMouseLeave(new MouseEvent('mouseleave'));
    expect(activeToolStub.onMouseLeave).not.toHaveBeenCalled();
  });

  // TESTS onMouseEnter

  it("#onMouseEnter devrait appeler onMouseEnter de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onMouseEnter');
    const event = new MouseEvent('mouseenter', { clientX: 0, clientY: 0 });
    component.onMouseEnter(event);
    expect(activeToolStub.onMouseEnter).toHaveBeenCalledWith(event);
  });
  it('#onMouseEnter ne devrait rien faire si la fonction onMouseEnter' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onMouseEnter');
    service.activeTool = service.toolList[1];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(activeToolStub.onMouseEnter).not.toHaveBeenCalled();
  });
  it("#onMouseEnter ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onMouseEnter');
    service.activeTool = service.toolList[2];
    component.onMouseEnter(new MouseEvent('mouseenter'));
    expect(activeToolStub.onMouseEnter).not.toHaveBeenCalled();
  });

  // TESTS onDblClick

  it("#onDblClick devrait appeler onDblClick de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onDoubleClick');
    const event = new MouseEvent('dblclick', { clientX: 0, clientY: 0 });
    component.onDblClick(event);
    expect(activeToolStub.onDoubleClick).toHaveBeenCalledWith(event);
  });
  it('#onDblClick ne devrait rien faire si la fonction onDblClick' +
    " de l'outil actif n'existe pas", () => {
    spyOn(activeToolStub, 'onDoubleClick');
    service.activeTool = service.toolList[1];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(activeToolStub.onDoubleClick).not.toHaveBeenCalled();
  });
  it("#onDblClick ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(activeToolStub, 'onDoubleClick');
    service.activeTool = service.toolList[2];
    component.onDblClick(new MouseEvent('dblclick'));
    expect(activeToolStub.onDoubleClick).not.toHaveBeenCalled();
  });

  // TESTS onRightClick

  it("#onRightClick devrait appeler onRightClick de l'outil actif si cette fonction existe", () => {
    spyOn(activeToolStub, 'onRightClick');
    const event = new MouseEvent('contextmenu', { clientX: 0, clientY: 0 });
    component.onRightClick(event);
    expect(activeToolStub.onRightClick).toHaveBeenCalledWith(event);
  });
  it('#onRightClick ne devrait rien faire si la fonction onRightClick de l\'outil actif n\'existe pas', () => {
    spyOn(activeToolStub, 'onRightClick');
    service.activeTool = service.toolList[2];
    component.onRightClick(new MouseEvent('contextmenu'));
    expect(activeToolStub.onRightClick).not.toHaveBeenCalled();
  });
  it('#onRightClick ne devrait rien faire si l\'outil actif n\'exsite pas dans le lexique d\'outils', () => {
    spyOn(activeToolStub, 'onRightClick');
    service.activeTool = service.toolList[2];
    component.onRightClick(new MouseEvent('contextmenu'));
    expect(activeToolStub.onRightClick).not.toHaveBeenCalled();
  });

  // TESTS getDrawingSurfaceClass

  it('#getDrawingSurfaceClass devrait renvoyer hide-cursor si l\'outil sélection est l\'efface', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.ERASER;
    expect(component.getDrawingSurfaceClass()).toEqual('hide-cursor');
  });

  it('#getDrawingSurfaceClass devrait renvoyer \'\' si l\'outil sélection n\'est pas l\'efface', () => {
    component['tools'].activeTool.ID = TOOL_INDEX.SELECTION;
    expect(component.getDrawingSurfaceClass()).toEqual('');
  });
});
