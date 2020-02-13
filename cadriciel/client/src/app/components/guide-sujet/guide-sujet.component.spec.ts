import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTENU_GUIDE} from '../page-guide/SujetsGuide';
import { GuideSujet } from './guide-sujet';
import { GuideSujetComponent } from './guide-sujet.component';

describe('GuideSujetComponent', () => {
  let component: GuideSujetComponent;
  let fixture: ComponentFixture<GuideSujetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideSujetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST onNotify

  it('#onNotify() devrait emettre un sujet', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[5];
    spyOn(component.notification, 'emit');

    component.onNotify(sujet);
    expect(component.notification.emit).toHaveBeenCalledWith(sujet);
  });

  // TESTS onClick

  it('#onClick() est appelé sur un sujet alors celui-ci doit être émit via notification', () => {
    component.noeud = CONTENU_GUIDE[0];   // Sujet de Bienvenue
    spyOn(component.notification, 'emit');

    component.onClick();

    expect(component.notification.emit).toHaveBeenCalledWith(CONTENU_GUIDE[0]);
  })

  it('#onClick() est appelé sur une catégorie alors celle-ci devrait être ouverte', () => {
      component.noeud = CONTENU_GUIDE[1];   // Catégorie des outils
      component.noeud.categorieOuverte = false;
      component.onClick();
      expect(component.noeud.categorieOuverte).toBe(true);
  });

});
