import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { SUJET_VIDE } from 'src/app/services/navigation-guide.service';
import { GuideSujet } from '../guide-sujet/subject-guide';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { PageGuideComponent } from './page-guide.component';
import { CONTENU_GUIDE } from './guide-contents';

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

  // TESTS clic

  it('#clic(1) devrait le sujet après Bienvenue, le Crayon', () => {
    // Correspond au bouton suivant
    component.clic(1);
    expect(component.activeSubject.nom).toBe('Crayon');
  });

  it('#clic(-1) devrait retourner le sujet avant Bienvenue, soit un SujetVide', () => {
    // Correspond au bouton precedant
    component.clic(-1);
    expect(component.activeSubject).toBe(SUJET_VIDE);
  });

  it('#clic ne devrait rein faire si le sujet Actif n\' a pas d\'ID ', () => {
    component.activeSubject = CONTENU_GUIDE[1];
    component.clic(1);
    expect(component.activeSubject).toBe(CONTENU_GUIDE[1]);
  });

  it('#notificationReceived(), le activeSubject devrait être celui émis', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[3];
    component.notificationReceived(sujet);
    expect(component.activeSubject).toBe(sujet);
  })
});
