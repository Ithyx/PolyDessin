import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryElementComponent } from './gallery-element.component';

// tslint:disable: no-string-literal

describe('GalleryElementComponent', () => {
  let component: GalleryElementComponent;
  let fixture: ComponentFixture<GalleryElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryElementComponent);
    component = fixture.componentInstance;
    component['drawing'] = {
      _id: 0,
      name: 'test name',
      height: 200,
      width: 200,
      backgroundColor: {RGBA: [0, 0, 0, 1], RGBAString: 'rgba(0, 0, 0, 1)'},
      tags: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS de sanatize
  it('#sanatize devrait appeler la fonction bypassSecurityTrustHtml avec le bon paramètre', () => {
    const test = 'test string';
    const spy = spyOn(component['sanitizer'], 'bypassSecurityTrustHtml');
    component.sanatize(test);
    expect(spy).toHaveBeenCalledWith(test);
  });

  // TESTS getSelectionStatus
  it('#getSelectionStatus devrait retourner "selected" si isSelected est vrai', () => {
    component['isSelected'] = true;
    expect(component.getSelectionStatus()).toEqual('selected');
  });
  it('#getSelectionStatus devrait retourner "element-container" si isSelected est faux', () => {
    component['isSelected'] = false;
    expect(component.getSelectionStatus()).toEqual('element-container');
  });

  // TESTS getTags
  it('#getTags devrait retourner "aucune" si drawing.tags n\'existe pas', () => {
    delete component['drawing'].tags;
    expect(component.getTags()).toEqual(['aucune']);
  });
  it('#getTags devrait retourner "aucune" si drawing.tags est vide', () => {
    component['drawing'].tags = [];
    expect(component.getTags()).toEqual(['aucune']);
  });
  it('#getTags devrait retourner drawing.tags s\'il n\'est pas vide', () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    component['drawing'].tags = tags;
    expect(component.getTags()).toEqual(tags);
  });
});
