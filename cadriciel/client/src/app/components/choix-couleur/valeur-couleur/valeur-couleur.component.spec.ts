import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service';
import { ValeurCouleurComponent } from './valeur-couleur.component';

describe('ValeurCouleurComponent', () => {
  let component: ValeurCouleurComponent;
  let fixture: ComponentFixture<ValeurCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValeurCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValeurCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS modificationRGB
  it('#modificationRGB ne devrait rien faire si on tente d\'accder à un index non reconnue', () => {
    component.gestionnaireCouleur = new GestionnaireCouleursService(new ParametresCouleurService())
    const indexTest = component.gestionnaireCouleur.RGB.length + 1;
    const clavier = new Event('change', { });

    spyOn(component.gestionnaireCouleur, 'modifierRGB');

    component.modificationRGB(clavier, indexTest)

    expect(component.gestionnaireCouleur.modifierRGB).not.toHaveBeenCalled();

  });

  // TESTS verifierEntree
  it('#verifierEntree devrait renvoyer vrai, si on appuie sur une touche avec une lettre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'a'});
    expect(component.verifierEntree(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer vrai, si on appuie sur backspace', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'Backspace'});
    expect(component.verifierEntree(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer vrai, si on appuie sur une touche avec un nombre acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: '7'});
    expect(component.verifierEntree(clavier)).toBe(true);
  });

  it('#verifierEntree devrait renvoyer faux, si on appuie sur une touche avec une lettre non-acceptee', () => {
    const clavier = new KeyboardEvent('keypress', { key: 'v'});
    expect(component.verifierEntree(clavier)).toBe(false);
  });

  it('#verifierEntree devrait renvoyer faux, si on appuie sur une touche non reconnue', () => {
    const clavier = new KeyboardEvent('keypress', { key: '#'});
    expect(component.verifierEntree(clavier)).toBe(false);
  });

  // TEST onChampFocus
  it('#onChampBlur devrait activer le focus sur le champ d\'entree', () => {
    component.onChampFocus();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(true);
  });

  // TEST onChampBlur
  it('#onChampBlur devrait desactiver le focus sur le champ d\'entree', () => {
    component.onChampBlur();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  });

});
