import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SUJET_VIDE } from 'src/app/services/navigation-guide.service';
import { GuideSujet } from '../guide-sujet/guide-sujet';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { PageGuideComponent } from './page-guide.component';
import { CONTENU_GUIDE } from './SujetsGuide';

describe('PageGuideComponent', () => {
  let component: PageGuideComponent;
  let fixture: ComponentFixture<PageGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGuideComponent, GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClick(1) should return the subject after Bienvenue, Crayon', () => {
    // Correspond au bouton suivant
    component.onClick(1);
    expect(component.sujetActif.nom).toBe('Crayon');    // Pourquoi on ne peut pas passer un GuideSujet?
  });

  it('onClick(-1) should return the subject before Bienvenue, SujetVide', () => {
    // Correspond au bouton precedant
    component.onClick(-1);
    expect(component.sujetActif).toBe(SUJET_VIDE);
  });

  it('in case of sujetActif does not have an id, it should not change', () => {
    component.sujetActif = CONTENU_GUIDE[1];
    component.onClick(1);
    expect(component.sujetActif).toBe(CONTENU_GUIDE[1]);
  });

  it('sujetActif should become the sujet receive in onNotify()', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[3];
    component.onNotify(sujet);
    expect(component.sujetActif).toBe(sujet);
  })
});
