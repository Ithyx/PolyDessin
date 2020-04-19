import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { EMPTY_SUBJECT } from 'src/app/services/navigation-guide/navigation-guide.service';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { SubjectGuide } from '../guide-subject/subject-guide';
import { GUIDE_CONTENTS } from './guide-contents';
import { GuidePageComponent } from './guide-page.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('GuidePageComponent', () => {
  let component: GuidePageComponent;
  let fixture: ComponentFixture<GuidePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidePageComponent, GuideSubjectComponent ],
      imports: [ MatSidenavModule, RouterModule.forRoot([
      ]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS onClick

  it('#onClick devrait appeler le guide de navigation pour ouvrir les catégories', () => {
    spyOn(component['navigationGuide'], 'openCategories');
    component.onClick(1);
    expect(component['navigationGuide'].openCategories).toHaveBeenCalledWith(component['subjects']);
  });

  it('#onClick(1) devrait le sujet après Bienvenue, le Crayon', () => {
    // Correspond au bouton suivant
    component.onClick(1);
    expect(component['activeSubject'].name).toBe('Crayon');
  });

  it('#onClick(-1) devrait retourner le sujet avant Bienvenue, soit un SujetVide', () => {
    // Correspond au bouton precedant
    component.onClick(-1);
    expect(component['activeSubject']).toBe(EMPTY_SUBJECT);
  });

  it('#onClick ne devrait rien faire si le sujet Actif n\' a pas d\'ID ', () => {
    component['activeSubject'] = GUIDE_CONTENTS[1];
    component.onClick(1);
    expect(component['activeSubject']).toBe(GUIDE_CONTENTS[1]);
  });

  // TESTS leaveGuide

  it('#leaveGuide devrait appeler le guide de navigation pour fermer les catégories', () => {
    spyOn(component['navigationGuide'], 'closeCategories');
    component.leaveGuide();
    expect(component['navigationGuide'].closeCategories).toHaveBeenCalledWith(component['subjects']);
  });

  // TESTS notificationReceived

  it('#notificationReceived(), le activeSubject devrait être celui émis', () => {
    const sujet: SubjectGuide = GUIDE_CONTENTS[3];
    component.notificationReceived(sujet);
    expect(component['activeSubject']).toBe(sujet);
  });

});
