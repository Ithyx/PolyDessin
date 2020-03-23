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
    component.drawing = {
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
});
