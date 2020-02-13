import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
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
      declarations: [ PageGuideComponent, GuideSujetComponent ],
      imports: [ RouterModule.forRoot([
      ]) ]
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

  // TESTS onClick

  it('#onClick(1) devrait le sujet après Bienvenue, le Crayon', () => {
    // Correspond au bouton suivant
    component.onClick(1);
    expect(component.sujetActif.nom).toBe('Crayon');
  });

  it('#onClick(-1) devrait retourner le sujet avant Bienvenue, soit un SujetVide', () => {
    // Correspond au bouton precedant
    component.onClick(-1);
    expect(component.sujetActif).toBe(SUJET_VIDE);
  });

  it('#onClick ne devrait rein faire si le sujet Actif n\' a pas d\'ID ', () => {
    component.sujetActif = CONTENU_GUIDE[1];
    component.onClick(1);
    expect(component.sujetActif).toBe(CONTENU_GUIDE[1]);
  });

  it('#onNotify(), le sujetActif devrait être celui émis', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[3];
    component.onNotify(sujet);
    expect(component.sujetActif).toBe(sujet);
  })
});
