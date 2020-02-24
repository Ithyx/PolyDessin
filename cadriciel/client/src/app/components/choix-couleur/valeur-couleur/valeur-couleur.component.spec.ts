import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GestionnaireCommandesService } from 'src/app/services/commande/gestionnaire-commandes.service';
import { GestionnaireCouleursService } from 'src/app/services/couleur/gestionnaire-couleurs.service';
import { ParametresCouleurService } from 'src/app/services/couleur/parametres-couleur.service';
import { ValeurCouleurComponent } from './valeur-couleur.component';

describe('ValeurCouleurComponent', () => {
  let component: ValeurCouleurComponent;
  let fixture: ComponentFixture<ValeurCouleurComponent>;
  let commandes: GestionnaireCommandesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValeurCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValeurCouleurComponent);
    component = fixture.componentInstance;
    commandes = TestBed.get(GestionnaireCommandesService);
    component.gestionnaireCouleur = new GestionnaireCouleursService(new ParametresCouleurService(), commandes);

    fixture.detectChanges();
    fixture.autoDetectChanges()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS modificationRGB
  it('#modificationRGB devrait modifier le RGB si on entre une valeur hexadécimal', () => {
    const element = fixture.debugElement.query(By.css('input[class="hexRouge"]')).nativeElement;
    element.value = 0xff;

    spyOn(component.gestionnaireCouleur, 'modifierRGB');

    element.dispatchEvent(new Event('change'));

    expect(component.gestionnaireCouleur.modifierRGB).toHaveBeenCalled();
    expect(component.gestionnaireCouleur.RGB[component.INDEX_ROUGE]).toBe(255);
  });

  it('#modificationRGB devrait modifier le RGB si on entre un string non reconnu', () => {
    const element = fixture.debugElement.query(By.css('input[class="hexBleu"]')).nativeElement;
    element.value = 'test';

    spyOn(component.gestionnaireCouleur, 'modifierRGB');

    element.dispatchEvent(new Event('change'));

    expect(component.gestionnaireCouleur.modifierRGB).toHaveBeenCalled();
    expect(component.gestionnaireCouleur.RGB[component.INDEX_BLEU]).toBe(0);
  });

  it('#modificationRGB ne devrait pas modifier le RGB si l\'index est non recconu', () => {
    component.INDEX_BLEU = 5;
    const element = fixture.debugElement.query(By.css('input[class="hexBleu"]')).nativeElement;
    element.value = 0xff;

    spyOn(component.gestionnaireCouleur, 'modifierRGB');

    element.dispatchEvent(new Event('change'));

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

  // TEST desactiverRaccourcis
  it('#activerRaccourcis devrait activer le focus sur le champ d\'entree', () => {
    component.desactiverRaccourcis();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(true);
  });

  // TEST activerRaccourcis
  it('#activerRaccourcis devrait desactiver le focus sur le champ d\'entree', () => {
    component.activerRaccourcis();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  });

});
