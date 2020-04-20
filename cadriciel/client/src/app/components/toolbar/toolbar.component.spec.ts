import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogConfig, MatDialogModule, MatDialogRef, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { Injector } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingTool, TOOL_INDEX, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { AttributesPanelComponent } from '../attributes-panel/attributes-panel.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { ExportWindowComponent } from '../export-window/export-window.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { SavePopupComponent } from '../save-popup/save-popup.component';
import { ToolbarComponent } from './toolbar.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count
// tslint:disable: max-classes-per-file

/* Service stub pour réduire les dépendances */
const activeToolTest: DrawingTool = {
  name: 'stubActif',
  isActive: true,
  ID: 0,
  parameters: [{type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
               {type: 'select', name: 'Type', options: ['A', 'B'], chosenOption: 'A'}],
  iconName: ''
};

const inactiveToolTest: DrawingTool = {
  name: 'stubInactif',
  isActive: false,
  ID: 1,
  parameters: [],
  iconName: ''
};

const rectangle: DrawingTool = {
  name: 'stubRectangle',
  isActive: false,
  ID: 2,
  parameters: [],
  iconName: ''
};

const toolManagerStub: Partial<ToolManagerService> = {
  toolList: [
    activeToolTest,
    inactiveToolTest,
    rectangle
  ],
  activeTool: activeToolTest,
  findParameterIndex(nomParametre: string): number {
    return (nomParametre === 'Épaisseur') ? 0 : 1;
  }
};

describe('ToolbarComponent', () => {
  const injector = Injector.create(
    // tslint:disable-next-line: arrow-return-shorthand
    {providers: [{provide: MatDialogRef, useValue: {afterClosed: () => { return {subscribe: () => { return; }}; }}}]
  });

  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let service: ToolManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidePageComponent, ToolbarComponent, DrawingToolComponent,
        NewDrawingWarningComponent, GuideSubjectComponent, AttributesPanelComponent ],
      providers: [ {provide: ToolManagerService, useValue: toolManagerStub} ],
      imports: [MatSidenavModule, RouterModule.forRoot([
        {path: 'guide', component : GuidePageComponent}
    ]), MatDialogModule, BrowserAnimationsModule]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ NewDrawingWarningComponent ],
      }
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(ToolManagerService);
    fixture.detectChanges();
  });
  beforeEach(() => {
    service.toolList[0].isActive = true; // outil crayon
    service.toolList[1].isActive = false; // outil pinceau
    service.toolList[2].isActive = false; // outil rectangle
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS subcribe dans le constructeur

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction warningNewDrawing, '
    + 'qui est appelée si le paramètre estIgnoree est faux', () => {
    spyOn(component, 'warningNewDrawing');
    component['shortcuts'].newDrawingEmmiter.next(false);
    expect(component.warningNewDrawing).toHaveBeenCalled();
  });

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction warningNewDrawing, '
    + 'qui n\'est pas appelée si le paramètre estIgnoree est vrai', () => {
    spyOn(component, 'warningNewDrawing');
    component['shortcuts'].newDrawingEmmiter.next(true);
    expect(component.warningNewDrawing).not.toHaveBeenCalled();
  });

  // TESTS ngOnDestroy

  it('#ngOnDestroy devrait appeler la fonction next avec un booleen true comme paramètre', () => {
    spyOn(component['shortcuts'].newDrawingEmmiter, 'next');
    component.ngOnDestroy();
    expect(component['shortcuts'].newDrawingEmmiter.next).toHaveBeenCalledWith(true);
  });

  // TESTS onClick

  it('#onClick devrait changer d\'outil', () => {
    component.onClick(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.activeTool).toBe(service.toolList[1]); // on vérifie que l'outil actif est bien le deuxième
  });

  it('#onClick devrait mettre le nouvel outil sélectionné comme actif', () => {
    component.onClick(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.toolList[1].isActive).toBe(true); // on vérifie que le nouvel outil est bien "actif"
  });

  it('#onClick devrait mettre à jours le canvas si l\'outil en paramètre est l\'efface', () => {
    const spy = spyOn(component['canvas'], 'updateDrawing');
    service.toolList[1].ID = TOOL_INDEX.ERASER;
    component.onClick(service.toolList[1]);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS disableShortcuts

  it('#disableShortcuts devrait assigner vrai à focusOnInput', () => {
    component['shortcuts'].focusOnInput = false;
    component.disableShortcuts();
    expect(component['shortcuts'].focusOnInput).toBe(true);
  });

  // TESTS enableShortcuts

  it('#enableShortcuts devrait assigner faux à focusOnInput', () => {
    component['shortcuts'].focusOnInput = true;
    component.enableShortcuts();
    expect(component['shortcuts'].focusOnInput).toBe(false);
  });

  // TESTS warningNewDrawing

  it('#warningNewDrawing devrait appeler disableShortcuts', () => {
    spyOn(component['dialog'], 'open');
    spyOn(component, 'disableShortcuts');
    component.warningNewDrawing();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#warningNewDrawing devrait appeler open avec NewDrawingWarningComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component['dialog'], 'open');
    component.warningNewDrawing();
    expect(component['dialog'].open).toHaveBeenCalledWith(NewDrawingWarningComponent, dialogConfig);
  });

  // TESTS openSavePopup

  it('#openSavePopup devrait appeler disableShortcuts', () => {
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    spyOn(component, 'disableShortcuts');
    component.openSavePopup();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#openSavePopup devrait appeler open avec SavePopupComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    component.openSavePopup();
    expect(component['dialog'].open).toHaveBeenCalledWith(SavePopupComponent, dialogConfig);
  });

  // TESTS openGallery

  it('#openGallery devrait appeler disableShortcuts', () => {
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    spyOn(component, 'disableShortcuts');
    component.openGallery();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#openGallery devrait appeler open avec GalleryComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    component.openGallery();
    expect(component['dialog'].open).toHaveBeenCalledWith(GalleryComponent, dialogConfig);
  });

  // TESTS openExportWindow

  it('#openExportWindow devrait appeler disableShortcuts', () => {
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    spyOn(component, 'disableShortcuts');
    component.openExportWindow();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#openExportWindow devrait appeler open avec ExportWindowComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    component.openExportWindow();
    expect(component['dialog'].open).toHaveBeenCalledWith(ExportWindowComponent, dialogConfig);
  });

  // TESTS openGridWindow

  it('#openGridWindow devrait appeler disableShortcuts', () => {
    spyOn(component['dialog'], 'open');
    spyOn(component, 'disableShortcuts');
    component.openGridWindow();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#openGridWindow devrait appeler open avec GridOptionsComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    spyOn(component['dialog'], 'open');
    component.openGridWindow();
    expect(component['dialog'].open).toHaveBeenCalledWith(GridOptionsComponent, dialogConfig);
  });
});
