import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutilDessinComponent } from './outil-dessin.component';

describe('OutilDessinComponent', () => {
  let component: OutilDessinComponent;
  let fixture: ComponentFixture<OutilDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutilDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutilDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("#onClick devrait rendre l'outil courant actif après un clic de souris", () => {
    component.onClick();
    expect(component.outil.estActif).toBe(true);
  });

  it("#OnClick ne devrait pas modifier l'outil courant", () => {
    component.onClick();
    expect(component.outil).toEqual({nom: 'defaut', estActif: true, idOutil: -1, parametres: []});
  });

  it("#onClick devrait émettre l'outil courant", () => {
    spyOn(component.notification, 'emit').and.callThrough();
    component.onClick();
    expect(component.notification.emit).toHaveBeenCalledWith(component.outil);
  });
});
