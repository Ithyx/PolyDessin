import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogConfig, MatDialogModule, MatDialogRef, MatSidenavModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';

import { Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Scope } from 'src/app/services/color/color-manager.service';
import { Color } from 'src/app/services/stockage-svg/draw-element';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { ColorInputComponent } from '../color-choice/color-input/color-input.component';
import { ColorPickerComponent } from '../color-choice/color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-choice/color-slider/color-slider.component';
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
      declarations: [ GuidePageComponent, ToolbarComponent, DrawingToolComponent, GuideSubjectComponent, ColorChoiceComponent,
                      ColorPickerComponent, ColorSliderComponent, ColorInputComponent ],
      providers: [ {provide: ToolManagerService, useValue: toolManagerStub} ],
      imports: [MatSidenavModule, RouterModule.forRoot([
        {path: 'guide', component : GuidePageComponent}
    ]), MatDialogModule, BrowserAnimationsModule]
    })
    .overrideModule(BrowserDynamicTestingModule, {set: { entryComponents: [ ColorChoiceComponent ] }})
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

  it('#ngOnDestroy devrait appeler la fonction unsubscribe', () => {
    spyOn(component, 'warningNewDrawing');
    component.ngOnDestroy();  // unsubscribe est appelée ici

    const toucheEnfoncee = new KeyboardEvent('keypress', { key: 'o', ctrlKey: true});
    component['shortcuts'].treatInput(toucheEnfoncee);

    // on teste que warningNewDrawing n'est plus lié aux raccourcis
    expect(component.warningNewDrawing).not.toHaveBeenCalled();
  });

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

  it('#onClick devrait appeler la fonction viderSVGEnCours', () => {
    spyOn(component['shortcuts'], 'clearOngoingSVG');
    component.onClick(service.toolList[2]); // on sélectionne l'outil 2 (rectangle)
    expect(component['shortcuts'].clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS onChange
  it('#onChange devrait changer la valeur de l\'épaisseur si l\'évènement qui lui est donné est un chiffre', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '1';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component['tools'].activeTool.parameters[0].value).toBe(1);
  });

  it('#onChange devrait changer la valeur de l\'épaisseur à 1 si l\'évènement qui lui est donné est inférieur à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '0';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component['tools'].activeTool.parameters[0].value).toBe(1);
  });

  // TESTS selectChoice

  it('#selectChoice ne devrait pas changer la valeur du paramètre si l\'évènement qui lui est donné n\'est pas un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.dispatchEvent(new Event('change')); // selectChoice appelée implicitement
    expect(component['tools'].activeTool.parameters[1].chosenOption).toBe('A');
  });

  it('#selectChoice devrait changer la valeur du paramètre si l\'évènement qui lui est donné est un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.value = 'B';
    element.dispatchEvent(new Event('change')); // selectChoice appelée implicitement
    expect(component['tools'].activeTool.parameters[1].chosenOption).toBe('B');
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

  // TESTS selectColor

  it('#selectColor devrait appeler disableShortcuts', () => {
    spyOn(component, 'disableShortcuts');
    component.selectColor('primary');
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#selectColor devrait assignee portee à Portee.Principale si le paramètre de la fonction contient principale', () => {
    component.selectColor('primary');
    expect(component['colorPickerPopup'].scope).toEqual(Scope.Primary);
  });

  it('#selectColor devrait assignee portee à Portee.Secondaire si le paramètre de la fonction contient secondaire', () => {
    component.selectColor('secondary');
    expect(component['colorPickerPopup'].scope).toEqual(Scope.Secondary);
  });

  it('#selectColor devrait assignee portee à Portee.fond si le paramètre de la fonction contient fond', () => {
    component.selectColor('background');
    expect(component['colorPickerPopup'].scope).toEqual(Scope.BackgroundToolBar);
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

  // TESTS selectPreviousPrimaryColor

  it('#selectPreviousPrimaryColor devrait assigner sa couleur en paramètre à couleurPrincipale', () => {
    component['colorParameter'].primaryColor.RGBAString = 'rgba(0, 0, 0, ';
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 1]
    };
    component.selectPreviousPrimaryColor(test);
    expect(component['colorParameter'].primaryColor).toEqual(test);
  });

  // TESTS selectPreviousSecondaryColor

  it('#selectPreviousSecondaryColor devrait assigner sa couleur en paramètre à couleurSecondaire', () => {
    component['colorParameter'].secondaryColor.RGBAString = 'rgba(0, 0, 0, ';
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 1]
    };
    component.selectPreviousSecondaryColor(test, new MouseEvent ('click'));
    expect(component['colorParameter'].secondaryColor).toEqual(test);
  });

  it("#selectPreviousSecondaryColor devrait s'assurer que preventDefault est appelé", () => {
    const evenement = new MouseEvent ('click');
    spyOn(evenement, 'preventDefault');
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 1]
    };
    component.selectPreviousSecondaryColor(test, evenement);
    expect(evenement.preventDefault).toHaveBeenCalled();
  });

  // TESTS applyPrimaryOpacity

  it("#applyPrimaryOpacity ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="primary-opacity"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // applyPrimaryOpacity appelée implicitement
    expect(component['colorParameter'].primaryColor.RGBA[3]).toBe(0.5);
  });

  it("#applyPrimaryOpacity devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="primary-opacity"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // applyPrimaryOpacity appelée implicitement
    expect(component['colorParameter'].primaryColor.RGBA[3]).toBe(0.1);
  });

  it("#applyPrimaryOpacity devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="primary-opacity"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // applyPrimaryOpacity appelée implicitement
    expect(component['colorParameter'].primaryColor.RGBA[3]).toBe(0);
  });

  it('#applyPrimaryOpacity devrait changer l\'opacité à 1 si la valeur qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="primary-opacity"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // applyPrimaryOpacity appelée implicitement
    expect(component['colorParameter'].primaryColor.RGBA[3]).toBe(1);
  });

  it('#applyPrimaryOpacity devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="primary-opacity"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // applyPrimaryOpacity appelée implicitement
    expect(component['colorParameter'].primaryOpacityDisplayed).toBe(75);
  });

  // TESTS applySecondaryOpacity

  it("#applySecondaryOpacity ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="secondary-opacity"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // applySecondaryOpacity appelée implicitement
    expect(component['colorParameter'].secondaryColor.RGBA[3]).toBe(0.5);
  });

  it("#applySecondaryOpacity devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="secondary-opacity"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // applySecondaryOpacity appelée implicitement
    expect(component['colorParameter'].secondaryColor.RGBA[3]).toBe(0.1);
  });

  it("#applySecondaryOpacity devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="secondary-opacity"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // applySecondaryOpacity appelée implicitement
    expect(component['colorParameter'].secondaryColor.RGBA[3]).toBe(0);
  });

  it("#applySecondaryOpacity devrait changer l'opacité à 1 si la valeur "
    + 'qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="secondary-opacity"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // applySecondaryOpacity appelée implicitement
    expect(component['colorParameter'].secondaryColor.RGBA[3]).toBe(1);
  });

  it('#applySecondaryOpacity devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="secondary-opacity"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // applySecondaryOpacity appelée implicitement
    expect(component['colorParameter'].secondaryOpacityDisplayed).toBe(75);
  });
});
