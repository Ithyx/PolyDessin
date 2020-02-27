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
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { NewDrawingWarningComponent } from '../new-drawing-warning/new-drawing-warning.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { BarreOutilsComponent } from './barre-outils.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: DrawingTool = {
  name: 'stubActif',
  isActive: true,
  ID: 0,
  parameters: [{type: 'number', name: 'Épaisseur', value: 5},
               {type: 'select', name: 'Type', options: ['A', 'B'], choosenOption: 'A'}],
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

const GestionnaireOutilServiceStub: Partial<ToolManagerService> = {
  toolList: [
    outilTestActif,
    outilTestInactif,
    rectangle
  ],
  activeTool: outilTestActif,
  findParameterIndex(nomParametre) {
    return (nomParametre === 'Épaisseur') ? 0 : 1;
  }
}

describe('BarreOutilsComponent', () => {
  let component: BarreOutilsComponent;
  let fixture: ComponentFixture<BarreOutilsComponent>;
  let service: ToolManagerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidePageComponent, BarreOutilsComponent, OutilDessinComponent, GuideSubjectComponent, ColorChoiceComponent,
                      ColorPickerComponent, ColorSliderComponent, ColorInputComponent ],
      providers: [ {provide: ToolManagerService, useValue: GestionnaireOutilServiceStub} ],
      imports: [ RouterModule.forRoot([
        {path: 'guide', component : GuidePageComponent}
    ]), MatDialogModule, BrowserAnimationsModule]
    })
    .overrideModule(BrowserDynamicTestingModule, {set: { entryComponents: [ ColorChoiceComponent ] }})
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BarreOutilsComponent);
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

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction avertissementNouveauDessin, '
    + 'qui est appelée si le paramètre estIgnoree est faux', () => {
    spyOn(component, 'avertissementNouveauDessin');
    component.shortcuts.newDrawingEmmiter.next(false);
    expect(component.avertissementNouveauDessin).toHaveBeenCalled();
  });

  it('#constructor devrait lier le gestionnaire de raccourcis avec la fonction avertissementNouveauDessin, '
    + 'qui n\'est pas appelée si le paramètre estIgnoree est vrai', () => {
    spyOn(component, 'avertissementNouveauDessin');
    component.shortcuts.newDrawingEmmiter.next(true);
    expect(component.avertissementNouveauDessin).not.toHaveBeenCalled();
  });

  // TESTS ngOnDestroy

  it('#ngOnDestroy devrait appeler la fonction unsubscribe', () => {
    spyOn(component, 'avertissementNouveauDessin');
    component.ngOnDestroy();  // unsubscribe est appelée ici

    const toucheEnfoncee = new KeyboardEvent('keypress', { key: 'o', ctrlKey: true});
    component.shortcuts.treatInput(toucheEnfoncee);

    // on teste que avertissementNouveauDessin n'est plus lié aux raccourcis
    expect(component.avertissementNouveauDessin).not.toHaveBeenCalled();
  });

  it('#ngOnDestroy devrait appeler la fonction next avec un booleen true comme paramètre', () => {
    spyOn(component.shortcuts.newDrawingEmmiter, 'next');
    component.ngOnDestroy();
    expect(component.shortcuts.newDrawingEmmiter.next).toHaveBeenCalledWith(true);
  });

  // TESTS clic

  it('#clic devrait changer d\'outil', () => {
    component.clic(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.activeTool).toBe(service.toolList[1]); // on vérifie que l'outil actif est bien le deuxième
  });

  it('#clic devrait mettre le nouvel outil sélectionné comme actif', () => {
    component.clic(service.toolList[1]); // on sélectionne l'outil 2
    expect(service.toolList[1].isActive).toBe(true); // on vérifie que le nouvel outil est bien "actif"
  });

  it('#clic devrait appeler la fonction viderSVGEnCours', () => {
    spyOn(component.shortcuts, 'clearOngoingSVG');
    component.clic(service.toolList[2]); // on sélectionne l'outil 2 (rectangle)
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
    expect(component.tools.activeTool.parameters[1].choosenOption).toBe('A');
  });

  it('#choixSelectionne devrait changer la valeur du paramètre si l\'évènement qui lui est donné est un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.value = 'B';
    element.dispatchEvent(new Event('change')); // choixSelectionne appelée implicitement
    expect(component.tools.activeTool.parameters[1].choosenOption).toBe('B');
  });

  // TESTS desactiverRaccourcis

  it('#desactiverRaccourcis devrait assigner vrai à focusOnInput', () => {
    component.shortcuts.focusOnInput = false;
    component.desactiverRaccourcis();
    expect(component.shortcuts.focusOnInput).toBe(true);
  });

  // TESTS activerRaccourcis

  it('#activerRaccourcis devrait assigner faux à focusOnInput', () => {
    component.shortcuts.focusOnInput = true;
    component.activerRaccourcis();
    expect(component.shortcuts.focusOnInput).toBe(false);
  });

  // TESTS avertissementNouveauDessin

  it('#avertissementNouveauDessin devrait appeler desactiverRaccourcis', () => {
    spyOn(component.dialog, 'open');
    spyOn(component, 'desactiverRaccourcis');
    component.avertissementNouveauDessin();
    expect(component.desactiverRaccourcis).toHaveBeenCalled();
  });

  it('#avertissementNouveauDessin devrait appeler open avec NewDrawingWarningComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component.dialog, 'open');
    component.avertissementNouveauDessin();
    expect(component.dialog.open).toHaveBeenCalledWith(NewDrawingWarningComponent, dialogConfig);
  });

  // TESTS selectionCouleur

  it('#selectionCouleur devrait appeler desactiverRaccourcis', () => {
    spyOn(component, 'desactiverRaccourcis');
    component.selectionCouleur('principale');
    expect(component.desactiverRaccourcis).toHaveBeenCalled();
  });

  it('#selectionCouleur devrait assignee portee à Portee.Principale si le paramètre de la fonction contient principale', () => {
    component.selectionCouleur('principale');
    expect(component.fenetreDessin.portee).toEqual(component.porteePrincipale);
  });

  it('#selectionCouleur devrait assignee portee à Portee.Secondaire si le paramètre de la fonction contient secondaire', () => {
    component.selectionCouleur('secondaire');
    expect(component.fenetreDessin.portee).toEqual(component.porteeSecondaire);
  });

  it('#selectionCouleur devrait assignee portee à Portee.fond si le paramètre de la fonction contient fond', () => {
    component.selectionCouleur('fond');
    expect(component.fenetreDessin.portee).toEqual(Scope.Background);
  });

  // TESTS selectionDerniereCouleurPrimaire

  it('#selectionDerniereCouleurPrimaire devrait assigner sa couleur en paramètre à couleurPrincipale', () => {
    component.colorParameter.primaryColor = 'rgba(0, 0, 0, ';
    component.selectionDerniereCouleurPrimaire('rgba(1, 1, 1, ');
    expect(component.colorParameter.primaryColor).toEqual('rgba(1, 1, 1, ');
  });

  // TESTS selectionDerniereCouleurSecondaire

  it('#selectionDerniereCouleurSecondaire devrait assigner sa couleur en paramètre à couleurSecondaire', () => {
    component.colorParameter.secondaryColor = 'rgba(0, 0, 0, ';
    component.selectionDerniereCouleurSecondaire('rgba(1, 1, 1, ', new MouseEvent ('click'));
    expect(component.colorParameter.secondaryColor).toEqual('rgba(1, 1, 1, ');
  });

  it("#selectionDerniereCouleurSecondaire devrait s'assurer que preventDefault est appelé", () => {
    const evenement = new MouseEvent ('click');
    spyOn(evenement, 'preventDefault')
    component.selectionDerniereCouleurSecondaire('rgba(1, 1, 1, ', evenement);
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
