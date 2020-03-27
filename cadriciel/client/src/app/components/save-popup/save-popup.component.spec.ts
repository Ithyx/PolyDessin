import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SavePopupComponent } from './save-popup.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('SavePopupComponent', () => {
  let component: SavePopupComponent;
  let fixture: ComponentFixture<SavePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePopupComponent ],
      imports: [ ReactiveFormsModule, FormsModule ],
      providers: [{provide: MatDialogRef, useValue: {close: () => { return; }}}, HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS constructor
  it('#constructor devrait initialiser les valeurs par défaut', () => {
    expect(component['name'].value).toBe(component['drawingParams'].name);
    expect(component['tag'].value).toBe('');
    expect(component['predefinedTag'].value).toBe('Portrait');
    expect(component['isSaving']).toBe(false);
    expect(component['isNameValid']).toBe(component['drawingParams'].name !== '');
    expect(component['isTagValid']).toBe(false);
    expect(component['saveFailed']).toBe(false);
    expect(component['PREDEFINED_TAGS']).toEqual(['Portrait', 'Paysage', 'Pixel Art', 'Abstrait', 'Futuriste', 'Minimaliste']);
  });

  // TESTS checkName
  it('#checkName devrait retourner false si le nom est vide', () => {
    component['name'].setValue('');
    expect(component.checkName()).toBe(false);
  });
  it('#checkName devrait retourner false si le nom n\'a pas été changé', () => {
    expect(component.checkName()).toBe(false);
  });
  it('#checkName devrait retourner true si le nom est non vide', () => {
    component['name'].setValue('non empty string');
    expect(component.checkName()).toBe(true);
  });

  // TESTS checkTag
  it('#checkTag devrait retourner false si le nom est vide', () => {
    component['tag'].setValue('');
    expect(component.checkTag()).toBe(false);
  });
  it('#checkTag devrait retourner false si le nom n\'a pas été changé', () => {
    expect(component.checkTag()).toBe(false);
  });
  it('#checkTag devrait retourner true si le nom est non vide', () => {
    component['tag'].setValue('non empty string');
    expect(component.checkTag()).toBe(true);
  });

  // TESTS confirmSave
  it('#confirmSave devrait mettre saveFailed à false si aucune erreur ne se produit', () => {
    component['name'].setValue('non empty string');
    component['saveFailed'] = true;
    spyOn(component['db'], 'saveDrawing').and.stub();
    expect(component.confirmSave().then(() => {
      expect(component['saveFailed']).toBe(false);
    })).toBeTruthy();
  });
  it('#confirmSave devrait mettre saveFailed à true si une erreur est lancée', () => {
    component['name'].setValue('non empty string');
    component['saveFailed'] = false;
    spyOn(component['db'], 'saveDrawing').and.throwError('error');
    expect(component.confirmSave().then(() => {
      expect(component['saveFailed']).toBe(true);
    })).toBeTruthy();
  });
  it('#confirmSave ne devrait pas sauvegarder le dessin si le nom est invalide', () => {
    component['name'].setValue(''); // valeur invalide
    const spy = spyOn(component['db'], 'saveDrawing').and.stub();
    expect(component.confirmSave().then(() => {
      expect(spy).not.toHaveBeenCalled();
    })).toBeTruthy();
  });

  // TESTS addTag
  it('#addTag devrait ajouter un tag valide à la liste', () => {
    component['drawingParams'].tags = ['tag1', 'tag2'];
    component['tag'].setValue('tag3');
    spyOn(component, 'checkTag').and.returnValue(true);
    component.addTag();
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
  it('#addTag ne devrait pas ajouter un tag si celui-ci n\'est pas valide (vide)', () => {
    component['drawingParams'].tags = ['tag1', 'tag2'];
    spyOn(component, 'checkTag').and.returnValue(false);
    component.addTag();
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag2']);
  });
  it('#addTag ne devrait pas ajouter un tag si celui-ci est déjà dans la liste', () => {
    component['drawingParams'].tags = ['tag1', 'tag2'];
    component['tag'].setValue('tag2');
    spyOn(component, 'checkTag').and.returnValue(true);
    component.addTag();
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag2']);
  });

  // TESTS addPredefinedTag
  it('#addPredefinedTag devrait ajouter un tag valide à la liste', () => {
    component['drawingParams'].tags = ['tag1', 'tag2'];
    component['predefinedTag'].setValue('tag3');
    component.addPredefinedTag();
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag2', 'tag3']);
  });
  it('#addPredefinedTag ne devrait pas ajouter un tag si celui-ci est déjà dans la liste', () => {
    component['drawingParams'].tags = ['tag1', 'tag2'];
    component['predefinedTag'].setValue('tag2');
    component.addPredefinedTag();
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag2']);
  });

  // TESTS deleteTag
  it('#deleteTag devrait supprimer toutes les instances du tag (normalement une seule) dans la liste', () => {
    component['drawingParams'].tags = ['tag1', 'tag2', 'tag2', 'tag2', 'tag2', 'tag3'];
    component.deleteTag('tag2');
    expect(component['drawingParams'].tags).toEqual(['tag1', 'tag3']);
  });
});
