import { HttpClient, HttpHandler } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatProgressSpinnerModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CanvasConversionService } from 'src/app/services/canvas-conversion.service';
import { DrawElement } from 'src/app/services/stockage-svg/draw-element/draw-element';
import { Drawing } from '../../../../../common/communication/drawing-interface';
import { GalleryLoadWarningComponent } from '../gallery-load-warning/gallery-load-warning.component';
import { GalleryElementComponent } from './gallery-element/gallery-element.component';
import { GalleryComponent, Status } from './gallery.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: max-file-line-count

const injector = Injector.create(
  // tslint:disable-next-line: arrow-return-shorthand
  {providers: [{provide: MatDialogRef, useValue: {afterClosed: () => { return {toPromise: () => { return; }}; }}}]
});

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const element: DrawElement = {
    svg: '',
    svgHtml: '',
    trueType: 0,
    points: [{x: 90, y: 90}, {x: 76, y: 89 }],
    erasingEvidence: false,
    erasingColor: {RGBA: [0, 0, 0, 1], RGBAString: ''},
    pointMin: {x: 0, y: 0},
    pointMax: {x: 0, y: 0},
    transform: {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0},
    draw: () => { return; },
    updateRotation: () => { return; },
    updateTransform: () => { return; },
    updateTranslation: () => { return; },
    updateTranslationMouse: () => { return; },
    updateParameters: () => { return; }
  };

  const drawing: Drawing = {
    _id: 0,
    name: 'post change name',
    height: 800,
    width: 800,
    backgroundColor: {RGBA: [255, 255, 255, 1], RGBAString: 'tets string'},
    tags: ['tag 1', 'tag 2'],
    elements: [element, element]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryComponent, GalleryElementComponent, GalleryLoadWarningComponent ],
      imports: [ MatProgressSpinnerModule, MatDialogModule, FormsModule, ReactiveFormsModule,
        RouterModule.forRoot([{path: 'dessin', component: GalleryComponent}]), BrowserAnimationsModule ],
      providers: [ { provide: MatDialogRef, useValue: {close: () => { return; }}},
                   { provide: CanvasConversionService, useValue: {updateDrawing: () => { return; }}},
                     HttpClient, HttpHandler ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ GalleryLoadWarningComponent ],
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TESTS constructor
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#constructor devrait remettre les tags de recherche vide', () => {
    expect(component['searchTags']).toEqual([]);
  });
  it('#constructor devrait mettre la sélection à null (pas de sélection)', () => {
    expect(component['selected']).toBe(null);
  });

  // TESTS ngOnInit
  it('#ngOnInit devrait appeler la fonction #update', () => {
    const spy = spyOn(component, 'update');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS update
  it('#update devrait appeler la fonction db.getData', () => {
    const spy = spyOn(component['db'], 'getData').and.stub();
    expect(component.update().then(() => {
      expect(spy).toHaveBeenCalled();
    })).toBeTruthy();
  });
  it('#update mettre l\'état à "loaded" si aucune erreur n\'est lancée', () => {
    spyOn(component['db'], 'getData').and.stub();
    expect(component.update().then(() => {
      expect(component['status']).toEqual(Status.Loaded);
    })).toBeTruthy();
  });
  it('#update mettre l\'état à "failed" si une erreur est lancée', () => {
    spyOn(component['db'], 'getData').and.throwError('test error');
    expect(component.update().then(() => {
      expect(component['status']).toEqual(Status.Failed);
    })).toBeTruthy();
  });

  // TESTS filter
  it('#filter mettre l\'état à "loaded" si aucune erreur n\'est lancée', () => {
    spyOn(component['db'], 'getDataWithTags').and.stub();
    expect(component.filter().then(() => {
      expect(component['status']).toEqual(Status.Loaded);
    })).toBeTruthy();
  });
  it('#filter mettre l\'état à "failed" si une erreur est lancée', () => {
    spyOn(component['db'], 'getDataWithTags').and.throwError('test error');
    expect(component.filter().then(() => {
      expect(component['status']).toEqual(Status.Failed);
    })).toBeTruthy();
  });
  it('#filter devrait ajouter une étiquette si elle n\'existe pas déjà', () => {
    component['searchTags'] = ['test1'];
    component['tagInput'].setValue('test2');
    component.filter();
    // l'ordre importe peu, il faut juste que les 2 existent
    expect(component['searchTags']).toContain('test1');
    expect(component['searchTags']).toContain('test2');
  });
  it('#filter ne devrait pas ajouter d\'étiquette si elle existe déjà', () => {
    component['searchTags'] = ['test'];
    component['tagInput'].setValue('test');
    component.filter();
    expect(component['searchTags']).toEqual(['test']);
  });
  it('#filter devrait mettre à jour la liste des dessins en appelant la méthode getDataWithTags', () => {
    const spy = spyOn(component['db'], 'getDataWithTags');
    component.filter();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS removeTag
  it('#removeTag mettre l\'état à "loaded" si aucune erreur n\'est lancée', () => {
    spyOn(component['db'], 'getDataWithTags').and.stub();
    expect(component.removeTag('').then(() => {
      expect(component['status']).toEqual(Status.Loaded);
    })).toBeTruthy();
  });
  it('#removeTag mettre l\'état à "failed" si une erreur est lancée', () => {
    spyOn(component['db'], 'getDataWithTags').and.throwError('test error');
    expect(component.removeTag('').then(() => {
      expect(component['status']).toEqual(Status.Failed);
    })).toBeTruthy();
  });
  it('#removeTag devrait enlever un le tag demandé de la liste s\'il existe', () => {
    component['searchTags'] = ['tag1', 'tag2', 'tag3'];
    component.removeTag('tag2');
    expect(component['searchTags']).toContain('tag1');
    expect(component['searchTags']).toContain('tag3');
    expect(component['searchTags']).not.toContain('tag2');
    expect(component['searchTags'].length).toBe(2);
  });
  it('#removeTag ne devrait pas modifier la liste si le tag n\'existe pas', () => {
    component['searchTags'] = ['tag1', 'tag2', 'tag3'];
    component.removeTag('tag4');
    expect(component['searchTags']).toContain('tag1');
    expect(component['searchTags']).toContain('tag2');
    expect(component['searchTags']).toContain('tag3');
    expect(component['searchTags'].length).toBe(3);
  });
  it('#removeTag ne devrait pas modifier une liste vide', () => {
    component['searchTags'] = [];
    component.removeTag('');
    expect(component['searchTags'].length).toBe(0);
  });
  it('#removeTag devrait mettre à jour la liste des dessins en appelant la méthode getDataWithTags', () => {
    const spy = spyOn(component['db'], 'getDataWithTags');
    component.removeTag('');
    expect(spy).toHaveBeenCalled();
  });

  // TESTS close
  it('#close devrait appeler la fonction dialogRef.close', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  // TESTS openWarning
  it('#openWarning devrait ouvrir l\'avertissement avec les bon paramètres', () => {
    const spy = spyOn(component['dialog'], 'open').and.returnValue(injector.get(MatDialogRef));
    component.openWarning();
    expect(spy).toHaveBeenCalledWith(GalleryLoadWarningComponent, component['dialogConfig']);
  });

  // TESTS loadDrawing
  it('#loadDrawing devrait ouvrir l\'avertissement si le dessin n\'est pas vide', () => {
    component['stockageSVG'].size = 1;
    const spy = spyOn(component, 'openWarning');
    component.loadDrawing(drawing);
    expect(spy).toHaveBeenCalled();
  });
  it('#loadDrawing ne devrait pas ouvrir l\'avertissement si le dessin est vide', () => {
    component['stockageSVG'].size = 0;
    const spy = spyOn(component, 'openWarning');
    component.loadDrawing(drawing);
    expect(spy).not.toHaveBeenCalled();
  });
  it('#loadDrawing ne devrait pas vider le dessin si l\'utilisateur annule', () => {
    component['stockageSVG'].size = 1;
    spyOn(component, 'openWarning').and.returnValue(Promise.resolve(true));
    const spy = spyOn(component['stockageSVG'], 'cleanDrawing');
    component.loadDrawing(drawing);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#loadDrawing devrait remttre les tags à 0 même si le nouveau dessin n\'en a pas', () => {
    component['drawingManager'].tags = ['tag1'];
    drawing.tags = undefined;
    component.loadDrawing(drawing);
    drawing.tags = ['tag 1', 'tag 2'];
    expect(component['drawingManager'].tags).toEqual([]);
  });
  it('#loadDrawing devrait naviguer vers la page de dessin et fermer le popup', () => {
    const navigSpy = spyOn(component['router'], 'navigate');
    const closeSpy = spyOn(component, 'close');
    component.loadDrawing(drawing);
    expect(navigSpy).toHaveBeenCalledWith(['dessin']);
    expect(closeSpy).toHaveBeenCalled();
  });

  /* it('#loadDrawing devrait changer complètement le dessin en cours', () => {
    const cleanSpy = spyOn(component['stockageSVG'], 'cleanDrawing');
    const addSpy = spyOn(component['saveUtility'], 'createCopyDrawElement');
    const drawingManager = component['drawingManager'];
    drawingManager.id = 123;
    drawingManager.height = 200;
    drawingManager.width = 200;
    drawingManager.backgroundColor = {
      RGBA: [0, 0, 0, 1],
      RGBAString: ''
    };
    drawingManager.name = 'pre change name';
    drawingManager.tags = [];

    component.loadDrawing(drawing);

    expect(cleanSpy).toHaveBeenCalled();
    expect(drawingManager.id).toBe(drawing._id);
    expect(drawingManager.height).toBe(drawing.height),
    expect(drawingManager.width).toBe(drawing.width),
    expect(drawingManager.backgroundColor).toEqual(drawing.backgroundColor);
    expect(drawingManager.name).toBe(drawing.name);
    expect(drawingManager.tags).toEqual(['tag 1', 'tag 2']);
    expect(addSpy).toHaveBeenCalledTimes(1);
  }); */
  it('#loadDrawing devrait remttre les éléments à 0 même si le nouveau dessin n\'en a pas', () => {
    drawing.elements = undefined;
    const spy = spyOn(component['saveUtility'], 'createCopyDrawElement');
    component.loadDrawing(drawing);
    drawing.elements = [element, element];
    expect(spy).not.toHaveBeenCalled();
  });

  // TESTS deleteDrawing
  it('#deleteDrawing devrait appeler la méthode db.delete', () => {
    const spy = spyOn(component['db'], 'deleteDrawing');
    component.deleteDrawing(drawing);
    expect(spy).toHaveBeenCalledWith(drawing._id);
  });
  it('#deleteDrawing remettre la sélection à null', () => {
    component['selected'] = 1;
    spyOn(component['db'], 'deleteDrawing').and.stub();
    expect(component.deleteDrawing(drawing).then(() => {
      expect(component['selected']).toBeNull();
    })).toBeTruthy();
  });
});
