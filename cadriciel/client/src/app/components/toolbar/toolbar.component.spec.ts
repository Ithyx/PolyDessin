import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogConfig, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Scope } from 'src/app/services/color/color-manager.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { ColorInputComponent } from '../color-choice/color-input/color-input.component';
import { ColorPickerComponent } from '../color-choice/color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-choice/color-slider/color-slider.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { ToolbarComponent } from './toolbar.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: DrawingTool = {
  name: 'stubActif',
  isActive: true,
  ID: 0,
  parameters: [{type: 'number', name: 'Épaisseur', value: 5},
               {type: 'select', name: 'Type', options: ['A', 'B'], chosenOption: 'A'}],
  iconName: ''
};

const outilTestInactif: DrawingTool = {
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

const gestionnaireOutilServiceStub: Partial<ToolManagerService> = {
  toolList: [
    outilTestActif,
    outilTestInactif,
    rectangle
  ],
  activeTool: outilTestActif,
  findParameterIndex(nomParametre: string): number {
    return (nomParametre === 'Épaisseur') ? 0 : 1;
  }
};

describe('BarreOutilsComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let service: ToolManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidePageComponent, ToolbarComponent, DrawingToolComponent, GuideSubjectComponent, ColorChoiceComponent,
                      ColorPickerComponent, ColorSliderComponent, ColorInputComponent ],
      providers: [ {provide: ToolManagerService, useValue: gestionnaireOutilServiceStub} ],
      imports: [ RouterModule.forRoot([
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
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS subcribe dans le constructeur

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction warningNewDrawing, '
    + 'qui est appelée si le paramètre estIgnoree est faux', () => {
    spyOn(component, 'warningNewDrawing');
    component.shortcuts.newDrawingEmmiter.next(false);
    expect(component.warningNewDrawing).toHaveBeenCalled();
  });

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction warningNewDrawing, '
    + 'qui n\'est pas appelée si le paramètre estIgnoree est vrai', () => {
    spyOn(component, 'warningNewDrawing');
    component.shortcuts.newDrawingEmmiter.next(true);
    expect(component.warningNewDrawing).not.toHaveBeenCalled();
  });

  // TESTS ngOnDestroy

  it('#ngOnDestroy devrait appeler la fonction unsubscribe', () => {
    spyOn(component, 'warningNewDrawing');
    component.ngOnDestroy();  // unsubscribe est appelée ici

    const toucheEnfoncee = new KeyboardEvent('keypress', { key: 'o', ctrlKey: true});
    component.shortcuts.treatInput(toucheEnfoncee);

    // on teste que warningNewDrawing n'est plus lié aux raccourcis
    expect(component.warningNewDrawing).not.toHaveBeenCalled();
  });

  it('#ngOnDestroy devrait appeler la fonction next avec un booleen true comme paramètre', () => {
    spyOn(component.shortcuts.newDrawingEmmiter, 'next');
    component.ngOnDestroy();
    expect(component.shortcuts.newDrawingEmmiter.next).toHaveBeenCalledWith(true);
  });

  // TESTS clic

  it('#clic devrait changer d\'outil', () => {
    component.onClick(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.activeTool).toBe(service.toolList[1]); // on vérifie que l'outil actif est bien le deuxième
  });

  it('#clic devrait mettre le nouvel outil sélectionné comme actif', () => {
    component.onClick(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.toolList[1].isActive).toBe(true); // on vérifie que le nouvel outil est bien "actif"
  });

  it('#clic devrait appeler la fonction viderSVGEnCours', () => {
    spyOn(component.shortcuts, 'clearOngoingSVG');
    component.onClick(service.toolList[2]); // on sélectionne l'outil 2 (rectangle)
    expect(component.shortcuts.clearOngoingSVG).toHaveBeenCalled();
  });

  // TESTS onChange
  it('#onChange devrait changer la valeur de l\'épaisseur si l\'évènement qui lui est donné est un chiffre', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '1';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component.tools.activeTool.parameters[0].value).toBe(1);
  });

  it('#onChange devrait changer la valeur de l\'épaisseur à 1 si l\'évènement qui lui est donné est inférieur à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '0';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component.tools.activeTool.parameters[0].value).toBe(1);
  });

  // TESTS choixSelectionne

  it('#choixSelectionne ne devrait pas changer la valeur du paramètre si l\'évènement qui lui est donné n\'est pas un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.dispatchEvent(new Event('change')); // choixSelectionne appelée implicitement
    expect(component.tools.activeTool.parameters[1].chosenOption).toBe('A');
  });

  it('#choixSelectionne devrait changer la valeur du paramètre si l\'évènement qui lui est donné est un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.value = 'B';
    element.dispatchEvent(new Event('change')); // choixSelectionne appelée implicitement
    expect(component.tools.activeTool.parameters[1].chosenOption).toBe('B');
  });

  // TESTS disableShortcuts

  it('#disableShortcuts devrait assigner vrai à focusOnInput', () => {
    component.shortcuts.focusOnInput = false;
    component.disableShortcuts();
    expect(component.shortcuts.focusOnInput).toBe(true);
  });

  // TESTS activerRaccourcis

  it('#activerRaccourcis devrait assigner faux à focusOnInput', () => {
    component.shortcuts.focusOnInput = true;
    component.enableShortcuts();
    expect(component.shortcuts.focusOnInput).toBe(false);
  });

  // TESTS warningNewDrawing

  it('#warningNewDrawing devrait appeler disableShortcuts', () => {
    spyOn(component.dialog, 'open');
    spyOn(component, 'disableShortcuts');
    component.warningNewDrawing();
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#warningNewDrawing devrait appeler open avec NewDrawingWarningComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component.dialog, 'open');
    component.warningNewDrawing();
    expect(component.dialog.open).toHaveBeenCalledWith(NewDrawingWarningComponent, dialogConfig);
  });

  // TESTS selectionCouleur

  it('#selectionCouleur devrait appeler disableShortcuts', () => {
    spyOn(component, 'disableShortcuts');
    component.selectColor('principale');
    expect(component.disableShortcuts).toHaveBeenCalled();
  });

  it('#selectionCouleur devrait assignee portee à Portee.Principale si le paramètre de la fonction contient principale', () => {
    component.selectColor('principale');
    expect(component.colorPickerPopup.portee).toEqual(component.primaryScope);
  });

  it('#selectionCouleur devrait assignee portee à Portee.Secondaire si le paramètre de la fonction contient secondaire', () => {
    component.selectColor('secondaire');
    expect(component.colorPickerPopup.portee).toEqual(component.secondaryScope);
  });

  it('#selectionCouleur devrait assignee portee à Portee.fond si le paramètre de la fonction contient fond', () => {
    component.selectColor('fond');
    expect(component.colorPickerPopup.portee).toEqual(Scope.Background);
  });

  // TESTS selectionDerniereCouleurPrimaire

  it('#selectionDerniereCouleurPrimaire devrait assigner sa couleur en paramètre à couleurPrincipale', () => {
    component.colorParameter.primaryColor = 'rgba(0, 0, 0, ';
    component.selectPreviousPrimaryColor('rgba(1, 1, 1, ');
    expect(component.colorParameter.primaryColor).toEqual('rgba(1, 1, 1, ');
  });

  // TESTS selectionDerniereCouleurSecondaire

  it('#selectionDerniereCouleurSecondaire devrait assigner sa couleur en paramètre à couleurSecondaire', () => {
    component.colorParameter.secondaryColor = 'rgba(0, 0, 0, ';
    component.selectPreviousSecondaryColor('rgba(1, 1, 1, ', new MouseEvent ('click'));
    expect(component.colorParameter.secondaryColor).toEqual('rgba(1, 1, 1, ');
  });

  it("#selectionDerniereCouleurSecondaire devrait s'assurer que preventDefault est appelé", () => {
    const evenement = new MouseEvent ('click');
    spyOn(evenement, 'preventDefault')
    component.selectPreviousSecondaryColor('rgba(1, 1, 1, ', evenement);
    expect(evenement.preventDefault).toHaveBeenCalled();
  });

  // TESTS appliquerOpacitePrincipale

  it("#appliquerOpacitePrincipale ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.colorParameter.primaryOpacity).toBe(0.5);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.colorParameter.primaryOpacity).toBe(0.1);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.colorParameter.primaryOpacity).toBe(0);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité à 1 si la valeur "
    + 'qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.colorParameter.primaryOpacity).toBe(1);
  });

  it('#appliquerOpacitePrincipale devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.colorParameter.primaryOpacityDisplayed).toBe(75);
  });

  // TESTS appliquerOpaciteSecondaire

  it("#appliquerOpaciteSecondaire ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.colorParameter.secondaryOpacity).toBe(0.5);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.colorParameter.secondaryOpacity).toBe(0.1);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.colorParameter.secondaryOpacity).toBe(0);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité à 1 si la valeur "
    + 'qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.colorParameter.secondaryOpacity).toBe(1);
  });

  it('#appliquerOpaciteSecondaire devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.colorParameter.secondaryOpacityDisplayed).toBe(75);
  });
});
