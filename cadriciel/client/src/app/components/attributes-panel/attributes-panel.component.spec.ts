import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Color } from 'src/app/services/color/color';
import { Scope } from 'src/app/services/color/color-manager.service';
import { DrawingTool, ToolManagerService } from 'src/app/services/tools/tool-manager.service';
import { ColorChoiceComponent } from '../color-choice/color-choice.component';
import { ColorInputComponent } from '../color-choice/color-input/color-input.component';
import { ColorPickerComponent } from '../color-choice/color-picker/color-picker.component';
import { ColorSliderComponent } from '../color-choice/color-slider/color-slider.component';
import { AttributesPanelComponent } from './attributes-panel.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

const activeToolTest: DrawingTool = {
  name: 'stubActif',
  isActive: true,
  ID: 0,
  parameters: [{type: 'number', name: 'Épaisseur', value: 5, min: 1, max: 100},
               {type: 'select', name: 'Type', options: ['A', 'B'], chosenOption: 'A'}],
  iconName: ''
};

const toolManagerStub: Partial<ToolManagerService> = {
  toolList: [
    activeToolTest
  ],
  activeTool: activeToolTest,
  findParameterIndex(nomParametre: string): number {
    return (nomParametre === 'Épaisseur') ? 0 : 1;
  }
};

describe('AttributesPanelComponent', () => {
  let component: AttributesPanelComponent;
  let fixture: ComponentFixture<AttributesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesPanelComponent, ColorChoiceComponent, ColorPickerComponent, ColorSliderComponent, ColorInputComponent ],
      providers: [ {provide: ToolManagerService, useValue: toolManagerStub} ],
      imports: [ MatDialogModule, BrowserAnimationsModule ]
    })
    .overrideModule(BrowserDynamicTestingModule, {set: { entryComponents: [ ColorChoiceComponent ] }})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  // TESTS selectPreviousPrimaryColor

  it('#selectPreviousPrimaryColor devrait assigner sa couleur en paramètre à couleurPrincipale', () => {
    component['colorParameter'].primaryColor.RGBA = [0, 0, 0, 1];
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 0.75]
    };
    component.selectPreviousPrimaryColor(test);
    expect(component['colorParameter'].primaryColor.RGBA).toEqual([1, 1, 1, 1]);
  });

  it('#selectPreviousPrimaryColor devrait appeler updateColors de colorParameter', () => {
    const spy = spyOn(component['colorParameter'], 'updateColors');
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 0.75]
    };
    component.selectPreviousPrimaryColor(test);
    expect(spy).toHaveBeenCalled();
  });

  // TESTS selectPreviousSecondaryColor

  it('#selectPreviousSecondaryColor devrait assigner sa couleur en paramètre à couleurSecondaire', () => {
    component['colorParameter'].secondaryColor.RGBA = [0, 0, 0, 1];
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 0.75]
    };
    component.selectPreviousSecondaryColor(test, new MouseEvent ('click'));
    expect(component['colorParameter'].secondaryColor.RGBA).toEqual([1, 1, 1, 1]);
  });

  it('#selectPreviousSecondaryColor devrait appeler updateColors de colorParameter', () => {
    const spy = spyOn(component['colorParameter'], 'updateColors');
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 0.75]
    };
    component.selectPreviousSecondaryColor(test, new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it("#selectPreviousSecondaryColor devrait s'assurer que preventDefault est appelé", () => {
    const event = new MouseEvent ('click');
    spyOn(event, 'preventDefault');
    const test: Color = {
      RGBAString : 'rgba(1, 1, 1, 1',
      RGBA: [1, 1, 1, 1]
    };
    component.selectPreviousSecondaryColor(test, event);
    expect(event.preventDefault).toHaveBeenCalled();
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
